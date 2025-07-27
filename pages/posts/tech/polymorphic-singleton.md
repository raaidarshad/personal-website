---
title: Polymorphic Singletons in Python
date: 2022/12/19
description: When you need an interface, but exactly once
tag: software
author: Raaid
---

# Polymorphic Singletons in Python

## The Problem

I was working in a context where I needed some configuration and functionality for each partner I was working with in a system. Each partner needed the same functionality, but each partner's _implementation_ of said functionality is different. There should also only ever be exactly **one** instance of this configuration and functionality for each partner, never more.

## Finding a solution

A bag of "configuration and functionality" sounds like a great use case for a [class](https://docs.python.org/3/tutorial/classes.html) in Python. Since each partner's implementation needs to be different, this might be a good use case for an [abstract class](https://docs.python.org/3/library/abc.html) with [abstract methods](https://docs.python.org/3/library/abc.html#abc.abstractmethod). In combination, we want [polymorphism](<https://en.wikipedia.org/wiki/Polymorphism_(computer_science)>), where we define a common interface, but each implementation of the interface is unique.

But what about the constraint of only **one** per partner? How can we guarantee this? Enter the oft controversial [singleton pattern](https://en.wikipedia.org/wiki/Singleton_pattern), which restricts instantiation to just one time.

## Creating it

Note: I did all this in at least Python3.10, so earlier versions might have some incompatibility.

### A simple class

So how do we encode all this? Lets start with the simplest part: a class definition.

```python
from dataclasses import dataclass

@dataclass
class MyClass:

    configuration_one: str
    configuration_two: int

    def my_method_one(self) -> str:
        pass

    def my_method_two(self) -> int:
        pass

    def my_method_three(self) -> str:
        return f"{self.configuration_one} and {self.configuration_two}"
```

I am opting to use a `dataclass` here since I don't have any complex class instantiation and don't need to bother to define an `__init__` method. Now a new class can inherit from this one and have the desired attributes (configuration) and methods (functionality).

```python
class MyNewClass(MyClass):
    def my_method_one(self) -> str:
        return self.configuration_one

    def my_method_two(self) -> int:
        return self.configuration_two

my_new_instance = MyNewClass(configuration_one="hi", configuration_two=5)

my_new_instance.my_method_three() # returns "hi and 5"

```

We can override the methods to be what we want, we can create an instance, and use it. Awesome. Wouldn't it be better if we provide clearer developer experience and make sure that if something inherits from `MyClass`, it _needs_ to implement the methods? We'll do this with abstract classes.

### Abstract base class

Let's update `MyClass` to be an abstract base class and turn it's methods into abstract methods (note that not every method needs to be an abstract method).

```python
from abc import ABC, abstractmethod  # new imports
from dataclasses import dataclass


@dataclass
class MyClass(ABC):  # new inheritance
    configuration_one: str
    configuration_two: int

    @abstractmethod  # new decorator use
    def my_method_one(self) -> str:
        pass

    @abstractmethod  # new decorator use
    def my_method_two(self) -> int:
        pass

    def my_method_three(self) -> str:
        return f"{self.configuration_one} and {self.configuration_two}"

```

Not a lot changed; we import `ABC` and `abstractmethod` from the standard library, then update our class to inherit from `ABC` and wrap the desired methods with `abstractmethod`.

Downstream, everything looks the same:

```python
class MyNewClass(MyClass):
    def my_method_one(self) -> str:
        return self.configuration_one

    def my_method_two(self) -> int:
        return self.configuration_two

my_new_instance = MyNewClass(configuration_one="hi", configuration_two=5)

my_new_instance.my_method_three() # returns "hi and 5"

```

The difference is that `MyNewClass` **must** define all abstract methods. If you try to instantiate `MyNewClass` without defining `my_method_two`, you will get a `TypeError`:

```python
class MyNewClass(MyClass):
    def my_method_one(self) -> str:
        return self.configuration_one

#    def my_method_two(self) -> int:
#        return self.configuration_two

my_new_instance = MyNewClass(configuration_one="hi", configuration_two=5) # raises a TypeError

```

This is a very helpful guardrail, in that your program will simply not work until you make sure to define the method and conform to the interface definition. We can, however, still create multiple instances of `MyNewClass`, which is not desired:

```python
class MyNewClass(MyClass):
    def my_method_one(self) -> str:
        return self.configuration_one

    def my_method_two(self) -> int:
        return self.configuration_two

my_new_instance = MyNewClass(configuration_one="hi", configuration_two=5)

my_new_instance.my_method_three()  # returns "hi and 5"

my_other_instance = MyNewClass(configuration_one="hello",
configuration_two=10)

my_new_instance == my_other_instance  # returns False
```

### Singleton

We have most of the desired functionality, and would probably be fine leaving it here. Having an additional guarantee that we truly only have one instance of our interface for each partner would be pretty slick though, so let's get there.

There are numerous implementations online for a singleton in Python. I ended up with some strange combination of a few of them that is working well for me as a singleton, and as an abstract base class. Much of it is pulled from [this excellent discussion](https://stackoverflow.com/questions/6760685/creating-a-singleton-in-python).

```python
import logging
from abc import ABCMeta


class SingletonABCMeta(ABCMeta):

    _instances = {}

    def __call__(cls, *args, **kwargs):
        if cls not in cls._instances:
            cls._instances[cls] = super(SingletonABCMeta, cls).__call__(*args, **kwargs)
        else:
            logging.warning(f"You tried to instantiate an instance of {cls.__name__} but one already exists.")
        return cls._instances[cls]
```

Okay, let's walk through this. First off, this is one step removed from our previous abstract base class named `MyClass`. `SingletonABCMeta` only defines the singleton aspect. It inherits from `ABCMeta` which is different from `ABC`. It is a [metaclass](https://realpython.com/python-metaclasses/). In short, you can think of a metaclass as a class factory, the thing that creates other classes. The standard one in Python is `type`. So in inheriting from `ABCMeta`, we are creating our own metaclass here.

Since this is a metaclass, we define the `__call__` method. Defining a custom **call**() method in the metaclass allows custom behavior when the class is called, e.g. not always creating a new instance, which is exactly what we want to do. When a class that has this as its metaclass is instantiated, we check to see if there is already an instance. If there is not, we create one and add it to `_instances`. If there is, we log a warning and return the existing instance. In this way, we guarantee that a class with `SingletonABCMeta` as its metaclass will only ever have one instance!

Now, we use it as the metaclass for `MyClass`:

```python
from abc import abstractmethod
from dataclasses import dataclass


@dataclass
class MyClass(metaclass=SingletonABCMeta):  # new metaclass assignment
    configuration_one: str
    configuration_two: int

    @abstractmethod
    def my_method_one(self) -> str:
        pass

    @abstractmethod
    def my_method_two(self) -> int:
        pass

    def my_method_three(self) -> str:
        return f"{self.configuration_one} and {self.configuration_two}"

```

We switch out inheritance of `ABC` for metaclass assignment of `SingletonABCMeta`. Note that assigning a metaclass of `ABCMeta` is mostly equivalent to inheriting from `ABC`.

Then in our class that implements an interface, we keep it the same:

```python
class MyNewClass(MyClass):
    def my_method_one(self) -> str:
        return self.configuration_one

    def my_method_two(self) -> int:
        return self.configuration_two

my_new_instance = MyNewClass(configuration_one="hi", configuration_two=5)
my_other_instance = MyNewClass(configuration_one="hello", configuration_two=10)  # logs a warning

my_new_instance.my_method_three()  # returns "hi and 5"
my_other_instance.my_method_three()  # returns "hi and 5"

my_new_instance == my_other_instance  # returns True

```

We can no longer create multiple instances of `MyNewClass`. Even if we try to, it actually refers to the same original instantiation. You can handle it how you want; you can log a warning and continue to refer to the one instance, you can raise an error, whatever makes sense for your program.

## Conclusion

We successfully created a polymorphic singleton pattern! More importantly, we addressed our requirements. The metaclass enforces the singleton pattern, and the abstract base class and abstract methods guarantee a consistent interface that can be defined for each new partner. I personally find this to be super clean and amazing, and am thrilled with learning more about metaclasses.

Thanks for reading, hope you found this clear and useful.

Cheers,

+raaid

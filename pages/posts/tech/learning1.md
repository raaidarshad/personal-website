---
title: Learning log 1
date: 2021/9/30
description: A lot of SQL things
tag: software
author: Raaid
---

This week, my head-bashing was courtesy of SQL! Learned some good things though.

- A good reason to use SQLAlchemy/SQLModel if interacting with SQL from Python is that you can also use [Alembic](https://alembic.sqlalchemy.org/en/latest/index.html)! It is a pretty straightforward change management tool for your SQLAlchemy-defined tables/constraints/etc. For example, I made a typo in my table models and needed to add a unique constraint to a column. At the terminal (assuming you have it installed and your venv activated), I wrote:

```
> alembic init alembic
# then I added my database's connection string to alembic.ini
> alembic revision -m "add unique constraint to article.url"
# filled out the upgrade and downgrade functions in the revision file
> alembic upgrade head
```
And thats it! The first comment is truly just a one line change, and filling out the upgrade/downgrade was really easy. The `revision` command creates a stub for the file, and you just need to fill out the body of the two functions. Here is all I wrote:
```
def upgrade():
    op.create_unique_constraint("unique_article_url", "article", ["url"])


def downgrade():
    op.drop_constraint("unique_article_url", "article")
```
Nice and easy.

- [Super useful StackOverflow link](https://stackoverflow.com/a/6584134) for deleting all duplicate rows in a table. Saved me a lot of time, and I simply changed the `DELETE` to a `SELECT` to get the problematic `id`s so I could delete connected data in other tables as well
- More random Postgres queries I found useful to have lying around for debugging, courtesy of another [StackOverflow answer](https://stackoverflow.com/a/22902857) when I was investigating a locked/hanging process
- SQLAlchemy supports `ON CONFLICT` handling in their insert statements! Between [this](https://docs.sqlalchemy.org/en/14/dialects/postgresql.html#insert-on-conflict-upsert) and [this](https://docs.sqlalchemy.org/en/14/tutorial/data_insert.html#insert-usually-generates-the-values-clause-automatically) all I had to change was:
```
# from this
db_client.add_all(db_articles)
# to this instead
insert_statement = insert(Article).on_conflict_do_nothing(index_elements=["url"])
db_client.exec(statement=insert_statement, params=db_articles)
```
And voila, any conflicts on my unique `url` column are handled as desired.


Cheers,

+raaid

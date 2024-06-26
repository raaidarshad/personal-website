import type { NextApiResponse, NextApiRequest } from 'next'
 
import { S3 } from "@aws-sdk/client-s3";
type ResponseData = {
  message: string
}
 
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const s3Client = new S3({
    forcePathStyle: false,
    endpoint: "https://nyc3.digitaloceanspaces.com",
    region: "us-east-1",
    credentials: {
      accessKeyId: process.env.SPACES_KEY ?? "",
      secretAccessKey: process.env.SPACES_SECRET ?? ""
    }});

  s3Client.getObject({
    Bucket: "pugsly",
    Key: "gifts.json"
  }, async function(err, data) {
    if (!err) res.status(200).json({ message: await data?.Body?.transformToString().then((theString: string) => JSON.parse(theString)) ?? "merp" });
    else res.status(500).json({ message: "Something went wrong"});
  })
}
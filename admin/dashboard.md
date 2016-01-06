---
layout: topic
---

# Overview

The dashboard is a set of static HTML and JavaScript that use the
DragonPulse API to display the disk, general, network, and process
observations.

# Create

The URL of the DragonPulse API will be of the form

> https://${rest-api-id}.execute-api.${region}.amazonaws.com/${stage}

The rest-api-id may be discovered using the following the following command
(remember to use a backtick (`) surrounding the string DragonPulse)

```sh
$ aws apigateway get-rest-apis \
--query 'items[?name.contains(@, `DragonPulse`)].id' \
--output text
d15bvgy5j2
```

With this information, configure the DragonPulse UI client by setting the
DB_API variable in the file ui/content/js/config.js (be sure to set the stage
to the same value used in the <a href="./api.html">DragonPulse API</a>
configuration)

```js
var DB_API='https://d15bvgy5j2.execute-api.us-east-1.amazonaws.com/dev';
```

Once the configuration has set, an Amazon s3 bucket may be used to host the
client.  The bucket name must adhere to the
<a href="http://docs.aws.amazon.com/AmazonS3/latest/dev/BucketRestrictions.html"
target="_blank">Bucket Restrictions and Limitations</a>.  This includes using
lowercase names only.  The bucket should have a unique name so consider
appending your user name to the dragonpulse string

> dragonpulse-${identifier}

Create the bucket using the following command

```sh
$ aws s3 mb s3://dragonpulse-${identifier}
```

Copy the DragonPulse UI client to the bucket by issuing the following command

```sh
$ cd ui/content
$ aws s3 cp --recursive . s3://dragonpulse-${identifier}
```

The bucket must now be configured to accept web requests.  This is a two-step
process that first involves setting a bucket policy.  Edit the
ui/policy/bucket-policy.json file and update the ARN to use the bucket name

```json
"arn:aws:s3:::dragonpulse-${identifier}/*"
```

Once the bucket policy has been modified, configure the bucket policy using the
following command

```sh
$ cd ui/policy
$ aws s3api put-bucket-policy --bucket dragonpulse-${identifier} \
--policy file://bucket-policy.json
```

Finally, enable web requests on the bucket by setting the index document

```sh
$ aws s3 website s3://dragonpulse-${identifier} \
--index-document index.html
```

The DragonPulse dashboard should now be ready to use.

# Delete

The following command will delete the s3 bucket used for the
DragonPulse UI

```sh
$ aws s3 rm -r s3://dragonpulse-${identifier}
```

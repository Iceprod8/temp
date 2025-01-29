# Frontend

## Table of content
 - [Technologies](#technologies)
 - [Application organization](#application-organization)
 - [Available scripts](#available-scripts)
 - [Installation](#installation)
 - [Code quality process and tools](#code-quality)

## Technologies
- [ReactJs](https://fr.reactjs.org/), more on [React](https://overreacted.io/react-as-a-ui-runtime/) and [React Router](https://reacttraining.com/react-router/)
- [ES 2018](http://ecma-international.org/publications/files/ECMA-ST/Ecma-262.pdf)
- [Eslint](https://eslint.org/) configuration [AirBnB](https://github.com/airbnb/javascript)
- [Axios](https://github.com/axios/axios) for API call
- [ThreeJs](https://threejs.org/) for 3D

## Application organization


## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.


### `yarn deploy`

**Note: this is a homemade opration**

Build and upload the frontend into the s3 bucket.

## Installation

```
yarn install
yarn deploy
```

Certificates
* ```certbot certonly --manual -d app.orthoin3d.com```
* then copy the given file into s3
* Create/Update certificates in [ACM EC2 Service](https://console.aws.amazon.com/acm/home?region=us-east-1#/)
* copy (in order): cert.pem (body), privkey.pem (priv), fullchain.pem (chain)


* invalidate cloud front distribution

### S3 Configuration
Disable all "block public access"

Bucket policy:
```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::app.orthoin3d.com/*"
        }
    ]
}
```

Update CORS rules:
```
[
    {
        "AllowedHeaders": [
            "*"
        ],
        "AllowedMethods": [
            "GET",
            "HEAD"
        ],
        "AllowedOrigins": [
            "*"
        ],
        "ExposeHeaders": []
    }
]
```

Configure as a public bucket

## Code quality process and tools

### `yarn lint`
Linter

### `jscpd`
Code du verification

### `unimported`
Dead file (import) detector

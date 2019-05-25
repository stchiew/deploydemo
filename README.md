## deploydemo

Sample webpart for experimenting with deployment task

### Version history

| Version | Date         | Comments        |
| ------- | ------------ | --------------- |
| 1.0.0   | May 31, 2019 | Initial release |

### Usage

- run npm version <major,minor or patch>
- run gulp dist
- run gulp upload-app-pkg

### Features

- npm version
- version sync between package.json and package-solution.json
- deployment gulp tasks

### References

[Build and Release Pipeline](https://www.eliostruyf.com/configure-a-build-and-release-pipeline-for-your-sharepoint-framework-solution-deployments/)

```
npm install gulp-spsync-creds node-sppkg-deploy --save-dev --save-exact
```

### Notes

- The project includes a deploy.json file in the root folder. this contains the credentials and site URLs. DO NOT INCLUDE this into your git repository. Remember to add this into .gitignore. A sample called sample-deploy.json is included for reference purposes.

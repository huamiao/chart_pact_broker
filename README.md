# Pact Broker

* [Official Doc](https://github.com/pact-foundation/pact_broker)

## How to access the pact broker ui

* [Pact Broker UI](https://pact-broker.dev.allex.ai/)

The UI is protected by basic auth, you can get the credentials using the command bellow:  

```bash
vault read secret/rplanx/gke-dev/pact-broker
```

## How to setup a pact communication (Consumer -> Provider)

### Consumer

- (1) Install [pact-broker-cli](https://github.com/actano/pact-broker-cli) as dev dependency
- (2) First thing you have to do is defining what you need from the provider (pact definition) [Example](https://github.com/actano/allex-accounts/blob/5e16b38a7cd646ee75e2ba7a5b18d5214f717051/test/pact/authentication-service-pact.js)
- (3) Run your api tests against the pact definition (it will generate a pact file) [Example](https://github.com/actano/allex-accounts/blob/1f13f3e33697a03c464fda65c785e7e53a561f89/test/rest-endpoints/user-login/post-user-login.spec.js) 
- (4) Publish your pact file to the pact broker [Example](https://github.com/actano/allex-accounts/blob/6442b8c2fe13ffe4343345cb67a8039f27dddb5a/Jenkinsfile-k8s#L55-L72)
Don't forget the API_VERSION environment variable [Example](https://github.com/actano/allex-accounts/blob/6442b8c2fe13ffe4343345cb67a8039f27dddb5a/Jenkinsfile-k8s#L11)
- (5) Create a webhook between consumer -> provider [Example](https://github.com/actano/allex-accounts/blob/6442b8c2fe13ffe4343345cb67a8039f27dddb5a/Jenkinsfile-k8s#L73-L92)
Set the WEBHOOK_TARGET_URL [Example](https://github.com/actano/allex-accounts/blob/6442b8c2fe13ffe4343345cb67a8039f27dddb5a/Jenkinsfile-k8s#L12)

### Provider

- (5) Add verify pacts test file [Example](https://github.com/actano/rplan-authentication/blob/e64df3602f4a2cdb0ec56f8507d023129b4ac2bc/test/pact/verify-pact-with-consumers.js)
- (6) Configure pact variables [Example](https://github.com/actano/rplan-authentication/blob/e64df3602f4a2cdb0ec56f8507d023129b4ac2bc/Jenkinsfile-k8s#L10-L12)
- (7) Add "Verify Pacts" in the jenkins pipeline [Example](https://github.com/actano/rplan-authentication/blob/e64df3602f4a2cdb0ec56f8507d023129b4ac2bc/Jenkinsfile-k8s#L83-L103)

### Back to consumer

- (8) Add "Can I Deploy" check in the jenkins pipeline [Example](https://github.com/actano/allex-accounts/blob/6442b8c2fe13ffe4343345cb67a8039f27dddb5a/Jenkinsfile-k8s#L119-L136)

That's all!!! Your pact broker communication should work! 

### How the build/ci pipeline flow works

- Consumer changes the pact definition and pushes 
- Jenkins will kick off the consumer build 
- Consumer build will publish the new pact definition to pact broker
    - Pact broker will kick off a provider build
    - Provider build will verify pacts
- While the provider build is running, the consumer build will check periodically if it's possible to deploy via canIDeploy (timeout can be specified)          
    - After checked with success
        - The canIDeploy thread in the consumer will be green
        - The consumer will be deployed
    - If periodic checks finally failed (timeout is exceeded)
        - The provider and after that the consumer needs to be re-built

### Heads Up:
- When verifying a provider it is required to specify the branch of the consumers you want to verify it against. Usually, this configuration is on `.rplan-config` under the the `pact.tag` property and is hardcoded to `master`. If you created a new repo recently, and your main branch is `main`, be sure double check this configuration - either rename your branch to `master` or change the configuration to `master, main`.
- Be aware that `can-i-deploy` timeout is limited to 9 minutes. If your provider build takes longer than that, your consumer build will fail because of a time out. In this case, wait for the provider build to finish and manually re-run the consumer build. Now `can-i-deploy` will run quickly. Since the pact won't have changed and it is verified already, it should take just a few seconds.

 

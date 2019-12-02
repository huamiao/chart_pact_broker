# Pact Broker

* [Official Doc](https://github.com/pact-foundation/pact_broker)

## How to access the pact broker ui

* [Pact Broker UI](http://pact-broker.rplan.com/)

The UI is protected by basic auth, you can get the credentials using the command bellow:  

```bash
vault read secret/rplanx/gke-dev/pact-broker
```

## How to setup a pact communication (Consumer -> Provider)

### Consumer

- First thing you have to do is defining what you need from the provider (pact definition) [Example](https://github.com/actano/allex-accounts/blob/1f13f3e33697a03c464fda65c785e7e53a561f89/test/pact/authentication-service-pact.js)
- Run your api tests against the pact definition (it will generate a pact file) [Example](https://github.com/actano/allex-accounts/blob/1f13f3e33697a03c464fda65c785e7e53a561f89/test/rest-endpoints/user-login/post-user-login.spec.js) 
- Create a webhook between consumer -> provider [Example](https://github.com/actano/allex-accounts/blob/1f13f3e33697a03c464fda65c785e7e53a561f89/Jenkinsfile-k8s#L51-L53)
- Publish your pact file to the pact-broker [Example](https://github.com/actano/allex-accounts/blob/1f13f3e33697a03c464fda65c785e7e53a561f89/Jenkinsfile-k8s#L89-L91)
- Add Can I Deploy check in the jenkins pipeline [Example](https://github.com/actano/allex-accounts/blob/1f13f3e33697a03c464fda65c785e7e53a561f89/Jenkinsfile-k8s#L98-L115)

### Provider

- Add verify pacts test file [Example](https://github.com/actano/rplan-authentication/blob/f320f58c2b1c5e566b5d62a9a54183b73d9cbb49/test/pact/user-login.pact.js)
- Run the verify pacts in the jenkins pipeline [Example](https://github.com/actano/rplan-authentication/blob/f320f58c2b1c5e566b5d62a9a54183b73d9cbb49/Jenkinsfile-k8s#L44-L64)

That's all!!! Your pact broker communication should work! 

### How the build/ci pipeline flow works

- Consumer change the pact definition and push 
- Jenkins will kick off the Consumer Build 
- Consumer Build will publish the new pact definition to Pact Broker
- Consumer Build will check if it is possible to deploy periodically {canIDeploy} (timeout can be specified)          
- Pact Broker will kick off a deploy in the provider
- The Provider Build will verify pacts
- After verified with success the canIDeploy thead in the consumer will be green
- Your consumer will be deployed 
                

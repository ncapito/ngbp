angular.module('ngBoilerplate.mocks').service("mocks", ['localStorageService', '$httpBackend', function(
            localStorageService,
            $httpBackend){

        var mockData = {
            currentUser:{
                UserID: 1,
                UserName: "nix",
                FirstName: "Nick",
                Password: "Password",
                LastName: "Capito",
                IsAuthenticated: true
            }
        };
        var mocks = function(){
            /* jshint - W087 */
            debugger;
            /* jshint + W087 */
            var createIfDNE = function(currentKeys, id, data){
                if(!currentKeys.filter(function(item){ return item === id; }).length  ){
                    localStorageService.add(id, data);
                }
            };

            var getUserData = function(username){
                username = username || '';
                var currentKeys = localStorageService.keys();
                var found;
                angular.forEach(currentKeys, function(item){
                    if(!found && item.indexOf('user_') === 0){
                        var result = localStorageService.get(item);
                        if(result.UserName.toLowerCase() === username.toLowerCase()){
                            found = result;
                        }
                    }
                });
                return found;
            };

            //locations...
            // location id 1
            var currentKeys = localStorageService.keys();
             createIfDNE(currentKeys, 'user_'+ mockData.currentUser.UserID , mockData.currentUser);

            var reURLS = {
                logon: /\/api\/auth\/login\/?/,
                me: /\/api\/auth\/me\/?/
            };

            //if there is a currentuser in local storage respond!
            $httpBackend.whenDELETE(reURLS.me).respond(function(method,url){
                var result = localStorageService.remove('currentUser');
                var code = !!result ? 200 : 401;
                return [code, result, {}];
            });

            //if there is a currentuser in local storage respond!
            $httpBackend.whenGET(reURLS.me).respond(function(method,url){
                var result = localStorageService.get('currentUser');
                var code = !!result ? 200 : 401;
                return [code, result, {}];
            });
            //if there is a currentuser in local storage respond!
            $httpBackend.whenPOST(reURLS.logon).respond(function(method,url, data){
                //check if data is in localstorage
                var  json = angular.fromJson(data);
                var  result = getUserData(json.UserName);
                if(result && result.Password === json.Password){
                    //no op
                    //write to local storage.
                     localStorageService.add('currentUser', result);
                }else{
                    result = null;
                }
                var code = !!result ? 200 : 401;
                return [code, result, {}];
            });

            // Catch-all pass through for all other requests
            $httpBackend.whenGET(/.*/).passThrough();
            $httpBackend.whenPOST(/.*/).passThrough();
            $httpBackend.whenDELETE(/.*/).passThrough();
            $httpBackend.whenPUT(/.*/).passThrough();
        };
    return mocks;
    }
]);


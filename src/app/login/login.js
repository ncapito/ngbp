/**
 * Each section of the site has its own module. It probably also has
 * submodules, though this boilerplate is too simple to demonstrate it. Within
 * `src/app/home`, however, could exist several additional folders representing
 * additional modules that would then be listed as dependencies of this one.
 * For example, a `note` section could have the submodules `note.create`,
 * `note.delete`, `note.edit`, etc.
 *
 * Regardless, so long as dependencies are managed correctly, the build process
 * will automatically take take of the rest.
 *
 * The dependencies block here is also where component dependencies should be
 * specified, as shown below.
 */
angular.module( 'ngBoilerplate.login', [
  'plusOne'
])
/**
 * And of course we define a controller for our route.
 */
.service("LoginModel", ['$resource', function($resource){
        return $resource('api/auth/login');
}])
.controller('LoginCtrl', function( LoginModel, $scope ) {
        $scope.user = new LoginModel();
        $scope.alert = null;
        $scope.resetData = function(){
            localStorage.clear();
            window.location.reload(false);
        };

        $scope.login = function(){
            $scope.user.$save(function(msg){
                //success!  send them to the other site.
                $scope.alert  = null;
                location.href  = '/home';
            },
            function(error){
                //failed!
                $scope.alert = {
                    type: 'danger',
                    msg: '<i class="white fa fa-bolt"></i> Oops.. hopefully a coordination issue.  Want to try that again...?'
                };
            });
        };
})

;


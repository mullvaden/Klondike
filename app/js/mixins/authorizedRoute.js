export default Ember.Mixin.create({
    sessionBinding: 'App.session',
    authorizedApiName: '',

    beforeModel: function(transition) {
        if (!this.get('authorizedApiName')) {
            var message = 'must set authorizedApiName property when using AuthorizedRoute mixin';
            console.error(message);
            transition.abort();
            return Ember.Deferred.promise(function(deferred) {
                deferred.reject(message);
            });
        }

        var self = this;

        return this.get('session').then(function(session) {
            if (!session.get('isLoggedIn')) {
                var loginController = self.controllerFor('login');
                loginController.set('previousTransition', transition);
                loginController.set('isRedirected', true);
                transition.abort();
                self.transitionTo('login');
                return;
            }

            return session.isAllowed(self.get('authorizedApiName')).then(function(result) {
                if (!result) {
                    transition.abort();
                    self.transitionTo('denied');
                }
            });
        });
    },
});

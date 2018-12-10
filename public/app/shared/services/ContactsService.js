'use strict';

angular.module('KinoaApp')
    .factory('ContactsService', function ($http, $log, $q, _, EnumService) {
        var contactsEndpoint = '/contacts/';


        var getAllContacts = function(params) {
            var options = {
                cache: true
            }
            if (typeof params !== 'undefined') {
                options.params = params;
            }
            var deferred = $q.defer();
            $http.get(contactsEndpoint, options).success(function(data) {
                deferred.resolve(data);
            }).error(function() {
                deferred.reject("An error occurred while retrieving the contacts.");
            });
            return deferred.promise;
        }

        var searchContacts = function(filter) {

            var deferred = $q.defer();
            var params = encodeURI(JSON.stringify(filter));
            $http.get(contactsEndpoint + '?' + params).success(function(data) {
                deferred.resolve(data);
            }).error(function() {
                deferred.reject("An error occurred while retrieving the contacts.");
            });
            return deferred.promise;
        }

        var getContact = function(contactId) {
            var deferred = $q.defer();
            $http.get(contactsEndpoint + contactId).success(function(data) {
                if (data.firstname === 'MADAM'
                    || data.prefixname === 'MADAM'
                    || data.prefixname === 'Madam'
                    || data.prefixname === 'Mme'
                    || data.prefixname === 'madam'
                    || data.prefixname === 'Mme') {
                    data.civility = 'Madam';
                } else if (data.firstname === 'MISTER'
                    || data.prefixname === 'MITER'
                    || data.prefixname === 'Miseter'
                    || data.prefixname === 'Misster'
                    || data.prefixname === 'M.') {
                    data.civility = 'Mister';
                }
                deferred.resolve(data);
            }).error(function() {
                deferred.reject("An error occurred while retrieving the contact");
            });
            return deferred.promise;
        }

        var updateContact = function(contact) {
            var deferred = $q.defer();
            $http.put(contactsEndpoint + contact.id, contact).success(function(data) {
                deferred.resolve(data);
            }).error(function() {
                deferred.reject("An error occurred while trying to update the contact.");
            });
            return deferred.promise;
        }

        // Public methods
        return {
            getContact: getContact,
            getAllContacts: getAllContacts,
            updateContact: updateContact,
            searchContacts: searchContacts
        }




    });
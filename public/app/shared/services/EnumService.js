'use strict';

angular.module('KinoaApp')
    .factory('EnumService', function (_) {

        var companyStatus = [
            {
                id: 0,
                name: 'prospect',
                french: 'prospect'
            },
            {
                id: 1,
                name: 'Study in progress',
                french: 'Study in progress'
            },
            {
                id:2,
                name: 'folder to resume later',
                french: 'folder to resume later'
            },
            {
                id:3,
                name: 'reductions obtained',
                french: 'reductions obtained'
            },
            {
                id:4,
                name: 'reject',
                french: 'reject'
            },
            {
                id:5,
                name: 'complaint sent',
                french: 'complaint sent'
            },
            {
                id:6,
                name: 'commercial refusal',
                french: 'commercial refusal'
            },
            {
                id:7,
                name: 'zero folder',
                french: 'zero folder'
            },
            {
                id:8,
                name: 'stand by risk',
                french: 'stand by risk'
            },
            {
                id: 9,
                name: 'archived',
                french: 'archived'
            },
            {
                id:10,
                name: 'stand by taxes low',
                french: 'stand by taxes low'
            },
            {
                id:11,
                name: 'established bill',
                french: 'established bill'
            },
            {
                id:12,
                name: 'duplicate other client',
                french: 'duplicate other client'
            }
        ];

        var getCompanyStatus = function(statusId) {
            return _.where(companyStatus, {id: statusId})[0];
        }

        var civilities = [
            {
                id: 'madam',
                name: 'madam'
            },
            {
                id: 'mister',
                name: 'mister',

            }
        ]

        return {
            companyStatus: companyStatus,
            getCompanyStatus: getCompanyStatus,
            civilities: civilities
        }


    });
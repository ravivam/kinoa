'use strict';

angular.module('KinoaApp')
    .controller('CompanyListCtrl', function ($scope, $log, dpd, CountryService, AuthService, CompaniesService, EnumService, $modal, _, $location) {

        // Initialize filter
        $scope.filter = {};


        // Loading needed values
        $scope.companyStatusList = EnumService.companyStatus;
        $scope.companyStatusListFilter = angular.copy($scope.companyStatusList);
        var defaultStatus = {
            french: 'Tous'
        }
        $scope.companyStatusListFilter.unshift(defaultStatus);
        $scope.filter.status = defaultStatus;

        $scope.search = function(filter) {
            $log.log(filter);
            $scope.loading = "Loading in progress, please wait...";
            var options = buildSearchParams(filter);
            CompaniesService.getAllCompanies(options).then(function(data) {
                $scope.companyList = data;
                delete $scope.loading;
            });
        }

        var buildSearchParams = function(filter) {
            var searchParams = {
                includeCompanytouser: true,
                $limit: 500
            };
            if (filter.status) {
                searchParams.status = filter.status.id
            }
            if (filter.name) {
                searchParams.name = {
                    $regex: filter.name,
                    $options: 'i'
                }
            }
            return searchParams;
        }
        
        dpd.users.get(function (data, status, headers, config) {
            $scope.users = data;
        });

        // Methods
        $scope.changeCompanyStatus = function(companyId, companyStatus) {
            $log.log(companyId, companyStatus);
            dpd.companies.put(companyId, {status: companyStatus}, function(data, status, headers, config) {
                if (status < 400) {
                    var infoMessage = "Status of the company '" + data.name + "' Status of the company"
                    $log.log(infoMessage);
                    $scope.info = infoMessage;
                } else {
                    var errorMessage = "Error while updating the status of " + companyId;
                    $log.error(errorMessage);
                    $scope.error = errorMessage;
                }
            });
        }

        $scope.deleteCompany = function(company) {
            $log.log(company);
             var saisie = prompt("You are about to delete the company \n\n'" + company.name + "'\n\nTo confirm your choice, please type the name of the company in this field: ");
            if (saisie.toLowerCase() === company.name.toLowerCase()) {
                 (function(company2) { // IIFE FTW : http://bit.ly/18MDRaF
                    CompaniesService.deleteCompany(company2.id).then(function(response) {
                            var infoMessage = "The company'" + company2.name + "' has been properly removed."
                            $log.log(infoMessage);
                            $scope.info = infoMessage;
                            var index = $scope.companyList.indexOf(company2);
                            $scope.companyList.splice(index, 1);
                        }, function(err) {
                            var errorMessage = "Error while deleting " + company2.name;
                            $log.error(errorMessage);
                            $scope.error = errorMessage;
                            throw errorMessage;
                        });
                })(company);
            }
        }


        $scope.batchStatusUpdate = function(filter, companyList) {
            $log.log(filter.status.id);
            for (var index in companyList) {
                var company = companyList[index];
                $log.log(company);
                CompaniesService.updateCompany({id:company.id, status: filter.status.id}).then(function(data) {
                    var infoMessage = "The companies have been properly updated."
                    $scope.info = infoMessage;
                    $scope.search($scope.filter);
                });
            }
        }

        $scope.batchRightsUpdate = function(users, companyList) {
            if (typeof companyList === 'undefined') $scope.error = "The list is empty !";
            if (companyList.length > 499) {
                $scope.error = "You have too many results, thanks for filtering.";
                return;
            }
            for (var index in users) {
                var user = users[index];
                if (typeof user.companytouser === 'undefined') continue;
                for (var indexCompany in companyList) {
                    var company = companyList[indexCompany];
                    (function(company, user) { // IIFE FTW : http://bit.ly/18MDRaF
                        CompaniesService.getCompanyToUser(user, company).then(function(data) {
                            if (data.length > 0) {
                                var companytouser = data[0];
                                companytouser.rightsLevel = user.companytouser.rightsLevel;
                                CompaniesService.updateCompanytouser(companytouser).then(function(responseUpdate) {
                                    var infoMessage = "Companies have been properly updated."
                                    $scope.info = infoMessage;
                                    $scope.search($scope.filter);
                                });
                            } else {
                                var companytouser = {
                                    rightsLevel: user.companytouser.rightsLevel,
                                    companyId: company.id,
                                    userId: user.id
                                }
                                CompaniesService.createCompanytouser(companytouser).then(function(responseUpdate) {
                                    var infoMessage = "The companies have been properly updated."
                                    $scope.info = infoMessage;
                                    $scope.search($scope.filter);
                                });
                            }
                        });
                    })(company, user);
                }
            }
        }

        // Ng-grid options
        $scope.gridOptions = {
            data: 'companyList',
            enablePinning: false,
            columnDefs: [

                { field: "id",
                    displayName: "Open",
                    width: 50,
                    cellTemplate: 'app/pages/companyList/companyList/companyListDisplay.html'
                },
                { field: "name", displayName: "Name", width: 400, pinned: true },
                { field: "address1", displayName: "address1", width: 120 },
                { field: "postalCode", displayName: "postalCode", width: 80 },
                { field: "city", width: 120 },
                { field: "country", width: 40 },
                { field: "website", width: 120 },
                { field: "phone", width: 120 },
                { field: "fax", width: 120 },
                /*{ field: "company.siret", width: 120 },
                { field: "company.finess", width: 120 },
                { field: "company.legalStatus", width: 60 },
                { field: "company.status", width: 40 },
                { field: "company.comments", width: 120 },
                { field: "company.tfSum", width: 120 },
                { field: "company.cfeSum", width: 120 },
                { field: "company.thSum", width: 120 },
                { field: "company.surface", width: 120 },
                { field: "company.capacity", width: 120 },
                { field: "company.capacityType", width: 120 },*/
                { field: "id",
                    displayName: "Permission to access",
                    width: 140,
                    cellTemplate: '<button class="btn btn-default btn-sm" ng-click="openRightsModal(row.getProperty(col.field))">Edit rights</button>'
                },
                { field: "status",
                    displayName: "Status",
                    width: 200,
                    cellTemplate: 'app/pages/companyList/companyList/companyListStatusColumn.html'
                },
                { field: "id",
                    displayName: "Suppression",
                    width: 150,
                    cellTemplate: 'app/pages/companyList/companyList/companyListDeleteColumn.html'
                }
            ]

        };


        // Right management Modal
        $scope.openRightsModal = function(companyId) {
            $log.log("Opening modal for companyId : ", companyId);

            for (var index in $scope.users) {
                (function(user) { // IIFE FTW : http://bit.ly/18MDRaF
                    dpd.companytouser.get({companyId: companyId, userId: user.id}, function(result, status, headers, config) {
                        user.companytouser = result[0];
                    });
                })($scope.users[index])
            }

            var modalInstance = $modal.open({
                templateUrl: 'app/pages/companyList/companyList/companyListRightsModalContent.html',
                controller: ModalInstanceCtrl,
                resolve: {
                    company: function() {
                        for (var index in $scope.companyList) {
                            if ($scope.companyList[index].id === companyId) {
                                return $scope.companyList[index];
                            }
                        }
                    },
                    users: function() {
                        return $scope.users;
                    }
                }
            });

            modalInstance.result.then(function (company) {
                for (var index in company.users) {
                    var user = company.users[index];    
                    var companytouser = user.companytouser;
                    if (!companytouser || !companytouser.id) {
                        $log.log("We are creating company to user", companytouser);
                        if (typeof companytouser === 'undefined') {
                            continue;
                        }
                        companytouser.companyId = company.id;
                        companytouser.userId = user.id;
                        (function(company, companytouser) { // IIFE FTW : http://bit.ly/18MDRaF
                            dpd.companytouser.post(companytouser, function(result, status, headers, config) {
                                if (status < 400) {
                                    $log.log(result);
                                    var infoMessage = "Corporate Rights '" + company.name + "' update."
                                    $log.log(infoMessage);
                                    $scope.info = infoMessage;
                                } else {
                                    var errorMessage = "Error while updating company rights " + company.name;
                                    $log.err(errorMessage);
                                    $scope.error(errorMessage);
                                }
                            });

                        })(company, companytouser);
                    } else {
                        $log.log("We are updating company to user", companytouser);
                        dpd.companytouser.put(companytouser.id, companytouser, function(result, status, headers, config) {
                            if (status < 400) {
                                var infoMessage = "Corporate Rights '" + company.name + "' update."
                                $log.log(infoMessage);
                                $scope.info = infoMessage;
                            } else {
                                var errorMessage = "Error while updating company rights " + company.name;
                                $log.err(errorMessage);
                                $scope.error(errorMessage);
                            }
                        });
                    }
                }

            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

        var ModalInstanceCtrl = function ($scope, $modalInstance, company, users) {
            $scope.company = company;
            $scope.company.users = users;

            $scope.ok = function () {
                $modalInstance.close($scope.company);
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        };

    });
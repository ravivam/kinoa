describe("UNIT TEST", function() {
    var element;
    var $scope;
    
     // Before each test load our KinoaApp module
     //beforeEach(angular.mock.module('KinoaApp'));
      
     
    beforeEach(inject(function($compile, $rootScope) {
        $scope = $rootScope;
        element = angular.element("<div>{{2 + 2}}</div>");
        element = $compile(element)($rootScope)
    }))
   

    it('should equal 4', function() {
        $scope.$digest()
        expect(element.html()).toBe("4");
    })

     /* A simple test to verify the Contacts service exists
    it('CompaniesService should exist', function() {
    expect(CompaniesService).toBeDefined();
    })

    // A test to verify that calling getCompany() with an invalid user id and invalid company id, returns error
    it('should return 404', function() {
        expect(CompaniesService.getCompany(1, 2)).toEqual(404);
      });*/
})

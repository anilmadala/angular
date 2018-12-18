'use strict';

angular.module('ratefastApp').controller('BlogsController', function ($scope, $location, Blogs) {

    $scope.currentPage = 1;
    $scope.maxsize = 5;
    $scope.itemsperpage = 2;
    $scope.search = "";
    $scope.catId = "";
    $scope.blogs = new Object();
    $scope.blog = new Object();

    $scope.filterBlogs = function () {
        $scope.fullBlog = false;
        $scope.currentPage = "1";
        $scope.listBlogs($scope.currentPage);
    }

    $scope.singleBlog = function (blog) {
        $scope.Emptyblogs = false;
        $scope.fullBlog = true;
        $scope.blog = blog;
    }

    $scope.listBlogs = function (pagenumber) {
        $scope.Emptyblogs = false;

        var query = {
            pagenum: pagenumber,
            pageController: 'page'
        };
        $scope.currentPage = pagenumber;

        if ($scope.catId != "") {
            query.catId = $scope.catId;
            query.catController = 'cat';
        }

        if ($scope.search != "") {
            query.searchId = $scope.search;
            query.searchController = 'search';
        }
        debugger;

        Blogs.query(query).$promise.then(function (blogs) {
            debugger;
            if (blogs[0].blogs.length == 0) {
                $scope.Emptyblogs = true;
            }
            $scope.search = "";
            $scope.blogs = blogs[0].blogs;
            $scope.totalItems = blogs[0].totalitem;
            $scope.noOfPages = blogs[0].pages;

            if (!angular.isDefined($scope.recentBlogs))
                $scope.recentBlogs = angular.copy($scope.blogs);

        });

    }
});
// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])

.run(function ($ionicPlatform) {
  $ionicPlatform.ready(function () {
    if (window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});

angular.module('todo', ['ionic'])

.factory('Projects', function () {
  // projects 模块
  // 提供任务的增删改查功能
  var proj = {
    all: function () {
      var projectString = window.localStorage['projects'];
      if (projectString) {
        return angular.fromJson(projectString);
      }
      return [];
    },
    save: function (projects) {
      window.localStorage['projects'] = angular.toJson(projects);
    },
    newProject: function (projectTitle) {
      // Add a new project
      return {
        title: projectTitle,
        tasks: []
      };
    },
    getLastActiveIndex: function () {
      return parseInt(window.localStorage['lastActiveProject']) || 0;
    },
    setLastActiveIndex: function (index) {
      window.localStorage['lastActiveProject'] = index;
    }
  };
  return proj;
})

.controller('TodoCtrl', function ($scope, $timeout, $ionicModal, Projects, $ionicSideMenuDelegate) {
  $scope.projects = Projects.all();

  $scope.activeProject = $scope.projects[Projects.getLastActiveIndex()];

  var createProject = function (projectTitle) {
    var newProject = Projects.newProject(projectTitle);
    $scope.projects.push(newProject);
    Projects.save($scope.projects);
    $scope.selectProject(newProject, $scope.projects.length - 1);
  };

  // 创建并载入模型
  $ionicModal.fromTemplateUrl('new-task.html', function (modal) {
    $scope.taskModal = modal;
  }, {
    scope: $scope,
    animation: 'slide-in-up'
  });

  // 新项目
  $scope.newProject = function () {
    var projectTitle = prompt("your project name");
    if (projectTitle) {
      createProject(projectTitle);
    }
  };

  // 选中的项目
  $scope.selectProject = function (project, index) {
    $scope.activeProject = project;
    Projects.setLastActiveIndex(index);
    $ionicSideMenuDelegate.toggleLeft(false);
  };

  // 表单提交时调用
  $scope.createTask = function (task) {
    if (!$scope.activeProject || !task) {
      return;
    }
    $scope.activeProject.tasks.push({
      title: task.title
    });
    $scope.taskModal.hide();
    Projects.save($scope.projects);
    task.title = "";
  };

  // 打开新增的模型
  $scope.newTask = function () {
    $scope.taskModal.show();
  };

  // 关闭新增的模型
  $scope.closeNewTask = function () {
    $scope.taskModal.hide();
  };

  $scope.toggleProjects = function () {
    $ionicSideMenuDelegate.toggleLeft();
  };

  $timeout(function () {
    if ($scope.projects.length === 0) {
      while (true) {
        var projectTitle = prompt('your first project');
        if (projectTitle) {
          createProject(projectTitle);
          break;
        }
      }
    }
  });

});

angular.module('todoApp', [])
.controller('userCtrl', function ($scope, $timeout) {
    $scope.taskList = [];
    var data = localStorage.getItem('taskList');
    if (data !== null && data !== undefined) {
        $scope.taskList = JSON.parse(data);
    }
    $scope.name = '';
    $scope.dueTime = '';

    $scope.edit = true;
    $scope.currentId = 0;
    $scope.showMsg = false;
    $scope.incomplete = false; 

    $scope.addEditTask = function (id) {
        if (id == 'new') {
            $scope.edit = true;
            $scope.incomplete = true;
            $scope.name = '';
            $scope.dueTime = '';
        } else {
            $scope.edit = false;
            $scope.currentId = id;
            var obj = $scope.searchObj(id);
            if (obj) {
                $scope.name = obj.dataObj.name;
                $scope.dueTime = new Date(obj.dataObj.dueTime);
            }
        }
    };
    $scope.$watch('name', function () { $scope.validate(); });
    $scope.$watch('dueTime', function () { $scope.validate(); });

    $scope.validate = function () {
        $scope.incomplete = false;
        if ($scope.edit && (!$scope.name.length || !$scope.dueTime.toLocaleDateString().length)) {
            $scope.incomplete = true;
        }
    };
    $scope.saveChanges = function () {
        if ($scope.edit) {
            var randomId = Math.floor((Math.random() * 10000) + 1);
            $scope.taskList.push({ id: randomId, name: $scope.name, dueTime: $scope.dueTime.toLocaleDateString() })
        }
        else {
            var obj1 = $scope.searchObj($scope.currentId);
            $scope.taskList[obj1.index].name = $scope.name;
            $scope.taskList[obj1.index].dueTime = $scope.dueTime.toLocaleDateString();
        }
        localStorage.setItem('taskList', JSON.stringify($scope.taskList));
        $scope.showMsg = true;
        $timeout(function () { $scope.showMsg = false; }, 3000);
        $scope.edit = true;
        $scope.name = '';
        $scope.dueTime = '';
    }
    $scope.deleteTask = function (taskId) {
        var obj2 = $scope.searchObj(taskId);
        $scope.taskList.splice(obj2.index, 1);
        localStorage.setItem('taskList', JSON.stringify($scope.taskList));
    }

    $scope.searchObj = function (id) {
        for (var i = 0, len = $scope.taskList.length; i < len; i++) {
            if ($scope.taskList[i].id === id) return { dataObj: $scope.taskList[i], index: i };
        }
        return false;
    }
    $scope.isOverdue = function (dateString) {
        return new Date(dateString) < new Date();
    }

});
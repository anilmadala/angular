angular.module('ratefastApp')
.controller('PriorInjuryAddAnotherCtrl', function ($scope, $rootScope) {
    $scope.dateOptions = {
        changeMonth: true,
        changeYear: true,
        dateFormat: "mm/dd/yy",
        showAnim: "clip",
        maxDate: new Date(),
        minDate: "01/01/1910"
    };
    $scope.bodypartname = $rootScope.bodypartname;
    $scope.currentsectionId = $rootScope.currentsectionId;
    if ($scope.report.data[$rootScope.currentsectionId]) {
        if ($scope.report.data[$rootScope.currentsectionId][$scope.uniqueid]) {
            
            $scope.todos = $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid];
        }
    }
    else {
        $scope.todos = new Array();
    }

    debugger;
    $scope.addTodos = function () {
        debugger;
        if (!$scope.todos) {
            $scope.todos = new Array();
        }
        $scope.todos.push({ residualProblemsBaseline: 0 });
        $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid] = $scope.todos;
    }

    $scope.clearbodypart = function (index, length) {
        debugger;
        var confi = confirm("If you reset this row, you will lose all selections you have made for this body part.");
        if (confi) {
            $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid][length - index] = {};
        }
    }
    $scope.deletebodypart = function (index, length) {
        debugger;
        var confi = confirm("Are you sure you want to delete this prior injury?");
        if (confi) {
            $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid].splice(length - index, 1);
        }
    }
})
.controller('PriorInjuryShoulderAddAnotherCtrl', function ($scope, $rootScope) {
    $scope.dateOptions = {
        changeMonth: true,
        changeYear: true,
        dateFormat: "mm/dd/yy",
        showAnim: "clip",
        maxDate: new Date(),
        minDate: "01/01/1910"
    };
    $scope.bodypartname = $rootScope.bodypartname;
    $scope.tinymceOptions = {
        resize: false,
        menubar: false,
        plugins: '',
        browser_spellcheck: true,
        contextmenu: false,
        toolbar: "bold italic underline"
    };

    if ($scope.report.data[$rootScope.currentsectionId]) {
        if ($scope.report.data[$rootScope.currentsectionId][$scope.uniqueid]) {
            $scope.todos = $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid];
        }
    }
    else {
        $scope.todos = new Array();
    }

    debugger;
    $scope.addTodos = function () {
        debugger;
        if (!$scope.todos) {
            $scope.todos = new Array();
        }
        $scope.todos.push({ residualProblemsBaseline: 0 }); 
        $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid] = $scope.todos;
    }

    $scope.clearbodypart = function (index, length) {
        debugger;
        var confi = confirm("If you reset this row, you will lose all selections you have made for this body part.");
        if (confi) {
            $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid][length - index] = {};
        }
    }

    $scope.deletebodypart = function (index, length) {
        debugger;
        var confi = confirm("Are you sure you want to delete this prior injury?");
        if (confi) {
            $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid].splice(length - index, 1);
        }
    }
})
.controller('PriorInjuryKneeAddAnotherCtrl', function ($scope, $rootScope) {
    $scope.dateOptions = {
        changeMonth: true,
        changeYear: true,
        dateFormat: "mm/dd/yy",
        showAnim: "clip",
        maxDate: new Date(),
        minDate: "01/01/1910"
    };
    $scope.bodypartname = $rootScope.bodypartname;
    $scope.tinymceOptions = {
        resize: false,
        menubar: false,
        plugins: '',
        browser_spellcheck: true,
        contextmenu: false,
        toolbar: "bold italic underline"
    };

    if ($scope.report.data[$rootScope.currentsectionId]) {
        if ($scope.report.data[$rootScope.currentsectionId][$scope.uniqueid]) {
            
            $scope.todos = $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid];
        }
    }
    else {
        $scope.todos = new Array();
    }

    debugger;
    $scope.addTodos = function () {
        debugger;
        if (!$scope.todos) {
            $scope.todos = new Array();
        }
        $scope.todos.push({ residualProblemsBaseline: 0 });
        $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid] = $scope.todos;
    }

    $scope.clearbodypart = function (index, length) {
        debugger;
        var confi = confirm("If you reset this row, you will lose all selections you have made for this body part.");
        if (confi) {
            $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid][length - index] = {};
        }
    }
    $scope.deletebodypart = function (index, length) {
        debugger;
        var confi = confirm("Are you sure you want to delete this prior injury?");
        if (confi) {
            $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid].splice(length - index, 1);
        }
    }
})
.controller('SurgeryInjuryAddAnotherCtrl', function ($scope, $rootScope) {
    debugger;
    $scope.dateOptions = {
        changeMonth: true,
        changeYear: true,
        dateFormat: "mm/dd/yy",
        showAnim: "clip",
        maxDate: new Date(),
        minDate: "01/01/1910"
    };
    $scope.bodypartname = $rootScope.bodypartname;
    $scope.tinymceOptions = {
        resize: false,
        menubar: false,
        plugins: '',
        browser_spellcheck: true,
        contextmenu: false,
        toolbar: "bold italic underline"
    };
    if ($scope.report.data[$rootScope.currentsectionId]) {
        if ($scope.report.data[$rootScope.currentsectionId][$scope.uniqueid]) {
            
            $scope.todos = $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid];
        } else {
            debugger;
            $scope.todos = new Array();
        }
    }
    else {
        $scope.todos = new Array();
    }

    debugger;
    $scope.addTodos = function () {
        debugger;
        if (!$scope.todos) {
            $scope.todos = new Array();
        }
        $scope.todos.push({});
        $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid] = $scope.todos;
    }

    $scope.clearbodypart = function (index, length) {
        debugger;
        var confi = confirm("If you reset this row, you will lose all selections you have made for this body part.");
        if (confi) {
            $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid][length - index] = {};
        }
    }
    $scope.deletebodypart = function (index, length) {
        debugger;
        var confi = confirm("Are you sure you want to delete this surgery?");
        if (confi) {
            $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid].splice(length - index, 1);
        }
    }
})
.controller('SurgeryInjuryShoulderAddAnotherCtrl', function ($scope, $rootScope) {
    debugger;
    $scope.dateOptions = {
        changeMonth: true,
        changeYear: true,
        dateFormat: "mm/dd/yy",
        showAnim: "clip",
        maxDate: new Date(),
        minDate: "01/01/1910"
    };
    $scope.bodypartname = $rootScope.bodypartname;
    $scope.tinymceOptions = {
        resize: false,
        menubar: false,
        plugins: '',
        browser_spellcheck: true,
        contextmenu: false,
        toolbar: "bold italic underline"
    };
    if ($scope.report.data[$rootScope.currentsectionId]) {
        if ($scope.report.data[$rootScope.currentsectionId][$scope.uniqueid]) {
            
            $scope.todos = $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid];
        }
    }
    else {
        $scope.todos = new Array();
    }

    debugger;
    $scope.addTodos = function () {
        debugger;
        if (!$scope.todos) {
            $scope.todos = new Array();
        }
        $scope.todos.push({});
        $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid] = $scope.todos;
    }

    $scope.clearbodypart = function (index, length) {
        debugger;
        var confi = confirm("If you reset this row, you will lose all selections you have made for this body part.");
        if (confi) {
            $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid][length - index] = {};
        }
    }
    $scope.deletebodypart = function (index, length) {
        debugger;
        var confi = confirm("Are you sure you want to delete this surgery?");
        if (confi) {
            $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid].splice(length - index, 1);
        }
    }
})
.controller('SurgeryInjuryKneeAddAnotherCtrl', function ($scope, $rootScope) {
    debugger;
    $scope.dateOptions = {
        changeMonth: true,
        changeYear: true,
        dateFormat: "mm/dd/yy",
        showAnim: "clip",
        maxDate: new Date(),
        minDate: "01/01/1910"
    };
    $scope.bodypartname = $rootScope.bodypartname;
    $scope.tinymceOptions = {
        resize: false,
        menubar: false,
        plugins: '',
        browser_spellcheck: true,
        contextmenu: false,
        toolbar: "bold italic underline"
    };
    if ($scope.report.data[$rootScope.currentsectionId]) {
        if ($scope.report.data[$rootScope.currentsectionId][$scope.uniqueid]) {
            
            $scope.todos = $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid];
        }
    }
    else {
        $scope.todos = new Array();
    }

    debugger;
    $scope.addTodos = function () {
        debugger;
        if (!$scope.todos) {
            $scope.todos = new Array();
        }
        $scope.todos.push({});
        $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid] = $scope.todos;
    }

    $scope.clearbodypart = function (index, length) {
        debugger;
        var confi = confirm("If you reset this row, you will lose all selections you have made for this body part.");
        if (confi) {
            $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid][length - index] = {};
        }
    }
    $scope.deletebodypart = function (index, length) {
        debugger;
        var confi = confirm("Are you sure you want to delete this surgery?");
        if (confi) {
            $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid].splice(length - index, 1);
        }
    }
})
.controller('addanotherTreatmentChildCtrl', function ($scope, $rootScope, $cookies, $modal) {
    debugger;
    $scope.popupMessage = function () {
        var message = "Selecting 'Yes' indicates a request for authorization for this treatment, and this treatment may be required in the future. Selecting 'No' indicates that you are not requesting authorization today, but the treatment may be required in the future.";
        $rootScope.modalInstance = $modal.open({
            templateUrl: 'partials/popupmessage.html',
            controller: 'popupMessagectrl',
            resolve: {
                message: function () {
                    return message;
                }
            }
        });
    };

    $scope.bodypartname = $rootScope.bodypartname;
    $scope.formType = $cookies.formType;
    $scope.tinymceOptions = {
        resize: false,
        menubar: false,
        plugins: '',
        browser_spellcheck: true,
        contextmenu: false,
        toolbar: "bold italic underline"
    };
    $scope.childLabel = $scope.label;
    $scope.childid = $scope.labelclass;
    $scope.currentbodypart = $rootScope.currentbodypartId;

    if ($scope.childid == 'nsaids') {
        $scope.nsaidselects = ['Ibuprofen (Motrin, Advil)', 'Naproxen (Naprosyn, Aleve)', 'Etodolac (Lodine)', 'Ketorolac (Toradol)', 'Aspirin 325 mg OTC', 'Celecoxib (Celebrex)', 'Other'];
    }

    if ($scope.childid == 'msrelaxant') {
        $scope.nsaidselects = ['Baclofen', 'Cyclobenzaprine (Flexeril)', 'Tizanidine (Zanaflex)', 'Metaxalone (Skelaxin)', 'Diazepam (Valium)', 'Other'];
    }

    if ($scope.childid == 'opioids') {
        $scope.nsaidselects = ['Norco (hydrocodone + acetaminophen)', 'Percocet (oxycodone + acetaminophen)', 'Tylenol with Codeine (acetaminophen + codeine)', 'Other'];
    }

    if ($scope.childid == 'nonopioids') {
        $scope.nsaidselects = ['Tramadol (Ultram)', 'Tramadol + acetaminophen (Ultracet)', 'Other'];
    }

    if ($scope.childid == 'cortisone') {
        $scope.nsaidselects = [];
    }

    if ($scope.childid == 'nstablizers') {
        $scope.nsaidselects = ['Elavil', 'Gabapentin (Neurontin)', 'Other'];
    }

    if ($scope.childid == 'antimicrobials') {
        $scope.nsaidselects = ['Amoxicillin', 'Augmentin', 'Azithromycin', 'Bactrim DS (Trimethoprim-sulfamethoxazole)', 'Cefazolin (Ancef)', 'Doxycycline', 'Cephalexin (Keflex)', 'Other'];
    }

    if ($scope.childid == 'immunizations') {
        $scope.nsaidselects = ['Tetanus toxoid 0.5 mg IM x 1', 'Hepatitis A inactivated + Hepatitis B recombinant (Twinrix) 1 mL IM', 'Hepatitis B vaccine 1 mL IM', 'Other'];
    }
    if ($scope.childid == 'therapy') {
        $scope.nsaidselects = ['Physical Therapy', 'Chiropractic', 'Acupuncture', 'Other'];
    }
    if ($scope.childid == 'splints') {
        $scope.nsaidselects = [];
    }
    if ($scope.childid == 'injections') {
        $scope.nsaidselects = ['Soft tissue', 'Joint', 'Epidural', 'Other'];
    }
    if ($scope.childid == 'accesstosurgeon') {
        $scope.nsaidselects = [];
    }
    if ($scope.childid == 'referral') {
        $scope.nsaidselects = ['Dental', 'Dermatology', 'Internal medicine specialty', 'Neurology', 'Ophthalmology', 'Pain management', 'Physical medicine', 'Psychiatry', 'Surgery', 'Podiatry', 'Other'];
    }
    if ($scope.childid == 'diagnostic') {
        $scope.nsaidselects = ['X-ray', 'MRI', 'CT Scan', 'Office based testing', 'Pathology report', 'Other'];
    }
    debugger;

    $scope.selectedArray = [];
    $scope.newArray = function (selected, index, length) {
        debugger;
        $scope.isDisable = true;
        //if ($scope.selectedArray.indexOf(selected) == -1) {
        //    if (selected != 'Other') {
        //        $scope.selectedArray.push(selected);
        //    }
        //}

        debugger;
        $scope.selected = selected;
    };

    if ($scope.report.data[$rootScope.currentsectionId]) {
        if ($scope.report.data[$rootScope.currentsectionId][$scope.uniqueid]) {
            var a = $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid];
            $scope.nsaids = $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid];
        }
        else {
            $scope.nsaids = new Array();
        }
    }
    else {
        $scope.nsaids = new Array();
    }
    $scope.addanoth = new Array();

    //$scope.othernsaids = options;
    $scope.addNsaids = function (treatmntid) {
        debugger;
        //var options = $scope.nsaidselects;
        if ($scope.childid != 'splints' && $scope.childid != 'accesstosurgeon') {
            $scope.nsaids.push({});
            $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid] = $scope.nsaids;
            if ($scope.nsaids) {
                for (var i = 0; i < $scope.nsaids.length; i++) {
                    if ($scope.nsaids[i].selectnsaids != 'Other')
                        $scope.selectedArray.push($scope.nsaids[i].selectnsaids);
                }
            }
        }
    }

    $scope.clearbodypart = function (index, length, selectedoption) {
        debugger;
        var confi = confirm("If you reset this row, you will lose all selections you have made for this body part.");
        if (confi) {
            var selectedindex = $scope.selectedArray.indexOf(selectedoption);
            $scope.selectedArray.splice(selectedindex, 1);
            $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid][length - index] = {};

        }
    }

    $scope.deletebodypart = function (index, length, selectedoption) {
        debugger;
        var confi = confirm("Are you sure you want to delete this treatment?");
        if (confi) {
            $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid].splice(length - index, 1);
            if ($scope.selectedArray.length > 0) {
                for (var i = 0; i < $scope.selectedArray.length; i++) {
                    var selectedindex = $scope.selectedArray.indexOf(selectedoption);
                    $scope.selectedArray.splice(selectedindex, 1);
                }
            }
        }
    }
}).controller('DiagnosticCtrl', function ($scope, $rootScope, getFormdata, $builder, $filter) {
    $scope.bodypartname = $rootScope.bodypartname;
    var templatearray = new Array();
    var templateSectionData = new Array();
    $scope.defaultValue = {};
    $scope.currentData = '';
    $scope.sourceSection = 'bginfo';
    var scopeValidator = '';

    $scope.getSection = function (id) {
        if (id) {
            return $scope.$eval(id);
        }
    };

    $scope.setDefaultValues = function (section, bodypartname, actualbdid, index) {
        debugger;
        //Created New Object on template load for storing the data 
        if (typeof $scope.report.data[section.sectiondataid + bodypartname] != "object") {
            $scope.report.data[section.sectiondataid + bodypartname] = new Object();
        }

        $scope.defaultValue[section.sectiondataid + bodypartname] = new Object();

        if ($scope.currenttemplatedata.forms[bodypartname]) {
            templatearray.push(section.sectiondataid + bodypartname);
            $builder.forms[section.sectiondataid + bodypartname] = $scope.currenttemplatedata.forms[bodypartname];

        } else {
            templatearray.push(section.sectiondataid + bodypartname);
            $builder.forms[section.sectiondataid + bodypartname] = $scope.currenttemplatedata.forms["other"];
        }

        $scope.bodypart = true;
        $scope.selectedIndex = index;
        $scope.currentsection = section.sectionname;
        $scope.currentbodypart = bodypartname;
        $scope.currentsectionId = section.sectiondataid;
        $scope.filterBodypartid = actualbdid;

        //set the default Value for checkbox, radio and select2 while loading the template
        //if ($scope.currenttemplatedata.forms[bodypartname]) {
        //    for (var i = 0; i < $scope.currenttemplatedata.forms[bodypartname].length; i++) {
        //        if ($scope.currenttemplatedata.forms[bodypartname][i].component) {
        //            //radio and select2    
        //            if ($scope.currenttemplatedata.forms[bodypartname][i].component == 'radio' || $scope.currenttemplatedata.forms[bodypartname][i].component == 'select2' || $scope.currenttemplatedata.forms[bodypartname][i].component == 'select' || $scope.currenttemplatedata.forms[bodypartname][i].component == 'selectcolors') {
        //                if ($scope.currenttemplatedata.forms[bodypartname][i].uniqueid) {
        //                    var uniqueid = $scope.currenttemplatedata.forms[bodypartname][i].uniqueid;

        //                    if ($scope.report.data[$scope.currentsectionId + bodypartname][uniqueid]) {
        //                        $scope.defaultValue[$scope.currentsectionId + bodypartname][uniqueid] = $scope.report.data[$scope.currentsectionId + bodypartname][uniqueid];
        //                    }
        //                }
        //            }
        //            //Checkbox
        //            if ($scope.currenttemplatedata.forms[bodypartname][i].component == 'checkbox') {
        //                var setCheckbox = [];
        //                var checkboxValue = [];
        //                if ($scope.currenttemplatedata.forms[bodypartname][i]) {
        //                    for (var j = 0; j < $scope.currenttemplatedata.forms[bodypartname][i].options.length; j++) {
        //                        if ($scope.currenttemplatedata.forms[bodypartname][i].uniqueid) {
        //                            var uniqueid = $scope.currenttemplatedata.forms[bodypartname][i].uniqueid;
        //                            checkboxValue = $scope.report.data[section.sectiondataid + bodypartname][uniqueid];
        //                            var checkCondtion = false;
        //                            for (var k = 0; k < checkboxValue.length; k++) {
        //                                if (checkboxValue[k]) {
        //                                    if ($scope.currenttemplatedata.forms[bodypartname][i].options[j] == checkboxValue[k].trim()) {
        //                                       
        //                                        checkCondtion = true;
        //                                    }
        //                                }
        //                            }
        //                            setCheckbox.push(checkCondtion);
        //                        }
        //                    }

        //                    if ($scope.report.data[section.sectiondataid + bodypartname]) {
        //                       
        //                        $scope.defaultValue[section.sectiondataid + bodypartname][uniqueid] = setCheckbox;
        //                    }
        //                }

        //            }
        //        }
        //    }
        //}

        if ($scope.report) {
            for (var i = 0; i < $scope.report.sections.length; i++) {
                $builder.forms[$scope.report.sections[i].sectiondataid] = $scope.report.forms[$scope.report.sections[i].sectiondataid];
            }
        }
    }

    $scope.gettemplate = function (section, bodypartname, index) {
        debugger;
        //Load the template if not exist in the templateSectionData Array 
        $scope.bodypartname = bodypartname;
        $scope.bodypartid = bodypartname.id;
        $scope.bdpartname = bodypartname.bdsides;
        if (!templateSectionData[section.template]) {
            getFormdata.query({ id: section.template, formtype: 0, version: 0 }).$promise.then(function (responce) {
                $scope.templatedata = responce[0].dataform;
                debugger;                
                templateSectionData[section.template] = angular.fromJson(responce[0].dataform);
                $scope.currenttemplatedata = angular.fromJson(responce[0].dataform);
                //function to Set Values of template from database
                if (bodypartname.bdsides != 'none' && bodypartname.bdsides != '' && bodypartname.bdsides != 'n/a') {
                    var bodypartid = $filter('lowercase')(bodypartname.id) + $filter('lowercase')(bodypartname.bdsides);
                    $rootScope.currentsectionId = section.sectiondataid + bodypartid;
                    $rootScope.currentbodypartId = bodypartid;
                    $scope.setDefaultValues(section, bodypartid, bodypartname.id, index);
                }
                else {
                    var bodypartid = $filter('lowercase')(bodypartname.id);
                    $rootScope.currentsectionId = section.sectiondataid + bodypartid;
                    $rootScope.currentbodypartId = bodypartid;
                    $scope.setDefaultValues(section, bodypartid, bodypartname.id, index);
                }
            });
        }
        else {   //template already exists in the templateSectionData array 
            $scope.currenttemplatedata = templateSectionData[section.template];
            //function to Set Values of template from database
            if (bodypartname.bdsides != 'none' && bodypartname.bdsides != '' && bodypartname.bdsides != 'n/a') {
                var bodypartid = $filter('lowercase')(bodypartname.id) + $filter('lowercase')(bodypartname.bdsides);
                $rootScope.currentsectionId = section.sectiondataid + bodypartid;
                $rootScope.currentbodypartId = bodypartid;
                $scope.setDefaultValues(section, bodypartid, bodypartname.id, index);
            }
            else {
                var bodypartid = $filter('lowercase')(bodypartname.id);
                $rootScope.currentsectionId = section.sectiondataid + bodypartid;
                $rootScope.currentbodypartId = bodypartid;
                $scope.setDefaultValues(section, bodypartid, bodypartname.id, index);
            }
        }
    }
}).controller('addanotherxraydignostictestresultCtrl', function ($scope, $rootScope, getFormdata, $builder, $filter) {
    debugger;
    $scope.dateOptions = {
        changeMonth: true,
        changeYear: true,
        dateFormat: "mm/dd/yy",
        showAnim: "clip",
        maxDate: new Date(),
        minDate: "01/01/1910"
    };
    $scope.bodypartname = $rootScope.bodypartname;
    if ($scope.report.data[$rootScope.currentsectionId]) {
        if ($scope.report.data[$rootScope.currentsectionId][$scope.uniqueid]) {
           
            $scope.todos = $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid];
        }
    }
    else {
        $scope.todos = new Array();
    }

    debugger;
    $scope.addTodos = function () {
        debugger;
        if (!$scope.todos) {
            $scope.todos = new Array();
        }
        $scope.todos.push({});
        $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid] = $scope.todos;
    }

    $scope.clearbodypart = function (index, length) {
        debugger;
        var confi = confirm("If you reset this row, you will lose all selections you have made for this body part.");
        if (confi) {
            $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid][length - index] = {};
        }
    }
    $scope.deletebodypart = function (index) {
        debugger;
        var confi = confirm("If you delete this row, you will lose all selections you have made for this body part.");
        if (confi) {
            $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid].splice(length - index, 1);
        }
    }
}).controller('addanothermrictdignostictestresultCtrl', function ($scope, $rootScope, getFormdata, $builder, $filter) {
    debugger;
    $scope.dateOptions = {
        changeMonth: true,
        changeYear: true,
        dateFormat: "mm/dd/yy",
        showAnim: "clip",
        maxDate: new Date(),
        minDate: "01/01/1910"
    };
    $scope.bodypartname = $rootScope.bodypartname;
    if ($scope.report.data[$rootScope.currentsectionId]) {
        if ($scope.report.data[$rootScope.currentsectionId][$scope.uniqueid]) {
           
            $scope.todos = $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid];
        }
    }
    else {
        $scope.todos = new Array();
    }

    debugger;
    $scope.addTodos = function () {
        debugger;
        if (!$scope.todos) {
            $scope.todos = new Array();
        }
        $scope.todos.push({});
        $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid] = $scope.todos;
    }

    $scope.clearbodypart = function (index, length) {
        debugger;
        var confi = confirm("If you reset this row, you will lose all selections you have made for this body part.");
        if (confi) {
            $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid][length - index] = {};
        }
    }
    $scope.deletebodypart = function (index) {
        debugger;
        var confi = confirm("If you delete this row, you will lose all selections you have made for this body part.");
        if (confi) {
            $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid].splice(length - index, 1);
        }
    }
})
.controller('painassessmentloopCtrl', function ($scope, $rootScope, $filter, $modal) {
    $scope.checkPeriod = function (data) {
        return data + '. ';
    };
    $scope.cmchildArray = new Object;
    $scope.initFunction = function () {
        $scope.childIds = [{ checkboxId: "checkboxCurrentMedicationnsaidsChild", textboxId: "checkboxCurrentmedicationsnsaidsChildtextinput" }, { checkboxId: "checkboxCurrentMedicationtylenolChild", textboxId: "checkboxCurrentMedicationtylenolChildtextinput" }, { checkboxId: "checkboxCurrentMedicationopioidsChild", textboxId: "checkboxCurrentMedicationsopioidsChildtextinput" }, { checkboxId: "checkboxCurrentMedicationmusclerelaxantsChild", textboxId: "checkboxCurrentMedicationsmusclerelaxantsChildtextinput" }, { checkboxId: "checkboxCurrentMedicationtricyclicsChild", textboxId: "checkboxCurrentMedicationstricyclicsChildtextinput" }, { checkboxId: "checkboxCurrentMedicationnerveChild", textboxId: "checkboxCurrentMedicationsnervestablizersChildtextinput" }];
        $scope.printValue = '';
        $scope.populatedata = new Array;
        if ($scope.report.data['painassessment']) {
            $scope.report.data['painassessment'].effectsofmedication = false;
        }
        $scope.report.data['painassessment'].effectsofmedication = false;
        for (var i = 0; i < $scope.report.data['selectinjuries'].sibodypart.length; i++) {
            if ($scope.report.data['selectinjuries'].sibodypart[i].id != 'other') {
                if ($scope.report.data['selectinjuries'].sibodypart[i].bdsides != 'none') {
                    var bodypartname = $scope.report.data['selectinjuries'].sibodypart[i].text +' - '+ $filter('capitalize')($scope.report.data['selectinjuries'].sibodypart[i].bdsides);
                    $scope.allsectionIds = 'patientcomplaints' + $scope.report.data['selectinjuries'].sibodypart[i].id + $scope.report.data['selectinjuries'].sibodypart[i].bdsides;
                        
                }
                else {
                    var bodypartname = $scope.report.data['selectinjuries'].sibodypart[i].text;
                    $scope.allsectionIds = 'patientcomplaints' + $scope.report.data['selectinjuries'].sibodypart[i].id;
                }
            }
            else {
                if ($scope.report.data['selectinjuries'].sibodypart[i].bdsides != 'n/a') {
                    var bodypartname = $filter('capitalize')($scope.report.data['selectinjuries'].sibodypart[i].bdsystemother) + ' - ' + $filter('capitalize')($scope.report.data['selectinjuries'].sibodypart[i].bdpartother) + ' - ' + $filter('capitalize')($scope.report.data['selectinjuries'].sibodypart[i].bdsides);
                    $scope.allsectionIds = 'patientcomplaints' + $scope.report.data['selectinjuries'].sibodypart[i].bdsystemother + $scope.report.data['selectinjuries'].sibodypart[i].bdpartother + $scope.report.data['selectinjuries'].sibodypart[i].bdsides;
                }
                else {
                    var bodypartname = $filter('capitalize')($scope.report.data['selectinjuries'].sibodypart[i].bdsystemother) + ' - ' + $filter('capitalize')($scope.report.data['selectinjuries'].sibodypart[i].bdpartother);
                    $scope.allsectionIds = 'patientcomplaints' + $scope.report.data['selectinjuries'].sibodypart[i].bdsystemother + $scope.report.data['selectinjuries'].sibodypart[i].bdpartother;
                }
            }

            var addingValue = '';

            for (var j = 0; j < $scope.childIds.length; j++) {
                var childcheckboxId = $scope.childIds[j].checkboxId;
                var childtextboxId = $scope.childIds[j].textboxId;
                if ($scope.report.data[$scope.allsectionIds]) {
                    if ($scope.report.data[$scope.allsectionIds][childcheckboxId]) {

                        if ($scope.report.data[$scope.allsectionIds][childcheckboxId].length > 0) {
                            addingValue += $scope.report.data[$scope.allsectionIds][childcheckboxId];

                            if ($scope.report.data[$scope.allsectionIds][childtextboxId]) {
                                if ($scope.report.data[$scope.allsectionIds][childtextboxId].length > 0) {
                                    addingValue += '; comment: ' + $scope.checkPeriod($scope.report.data[$scope.allsectionIds][childtextboxId]);
                                } else {
                                    addingValue += '. ';
                                }
                            } else {
                                addingValue += '. ';
                            }

                            $scope.report.data['painassessment'].effectsofmedication = new Object;
                            $scope.report.data['painassessment'].effectsofmedication = true;
                        }
                    }
                }
            }
            if (addingValue) {
                $scope.populatedata.push({ 'bodypartname': bodypartname, 'text': addingValue });
            }
        }
        if ($scope.populatedata.length > 0) {
            debugger;
            $rootScope.populatedata = true;
        }
    };

    $scope.popupMessage = function (message, width) {

        $rootScope.modalInstance = $modal.open({
            templateUrl: 'partials/popupmessage.html',
            controller: 'popupMessagectrl',
            resolve: {
                message: function () {
                    return message;
                }
            }

        });

    };
})
.controller('labelhiddenCtrl', function ($scope, $rootScope, $filter) {
    //debugger;
    $scope.labeltoDisplay = eval($scope.displaycalculation);
    
})
.controller('billingcalculatorCtrl', function ($scope, $rootScope, $filter, $cookies) {
    debugger;
    $scope.report.data.bc = $scope.report.data['bc'];
    $scope.bcTemplateUrl = '';
    if ($rootScope.currentReportStatus == 'closed') {
        $scope.bcTemplateUrl = 'partials/billingcalculator' + $cookies.selectedStatecode + '.html';
    }

    $scope.getTotal = function () {
        debugger;
        var total = 0;
        for (var i = 0; i < $scope.report.data.bc.length; i++) {
            if ($scope.report.data.bc[i].billing.price) {
                var price = parseFloat($scope.report.data.bc[i].billing.price);
                total += price;
            }
        }
        return total.toFixed(2);
    };
})
.controller('SelectBodyPartForRatingCtrl', function ($scope, $rootScope, getFormdata, $builder, $filter,$modal) {
	$scope.dateOptions = {
	        changeMonth: true,
	        changeYear: true,
	        dateFormat: "mm/dd/yy",
	        showAnim: "clip",
	        maxDate: new Date(),
	        minDate: "01/01/1910"
	    };
	
	    $scope.bodypartname = $rootScope.bodypartname;
	    $scope.currentsectionId = $rootScope.currentsectionId;
	    $scope.formtype=$rootScope.formtype;
	   	    
	    $scope.getRedBorder = function () {	  
	    	//for hiding if MMI isn't set for any one body part
			var j=0
			var anyOnePresent='col-sm-12 rateBodyClass';
			var newdata=$scope.report.data.selectinjuries.sibodypart;
			
			for(j=0;j<newdata.length;j++){
				if(newdata[j].ratebodypart==true){
					if(typeof newdata[j].dateOfRating =="undefined")
						{
							newdata[j].ratebodyYesNoRadio='No';
							return anyOnePresent;
						}
						else if(newdata[j].dateOfRating ==''){
							return anyOnePresent;
						}
				}
			}
			
			for(j=0;j<newdata.length;j++){
				if(typeof newdata[j].ratebodyYesNoRadio !="undefined"){					
					if(newdata[j].ratebodyYesNoRadio=='Yes'){
						anyOnePresent='col-sm-12';
						break;
					}
				}
			}
			return anyOnePresent;	  
	    }
	    
	    $scope.bodyPartSelected = function () {	  
	    	//for hiding if MMI isn't set for any one body part
			var j=0
			var anyOnePresent=true;
			var newdata=$scope.report.data.selectinjuries.sibodypart;
			for(j=0;j<newdata.length;j++){
				if(typeof newdata[j].ratebodyYesNoRadio !="undefined"){
					if(newdata[j].ratebodyYesNoRadio=='Yes'){
						anyOnePresent=false;
						break;
					}
				}
			}
			return anyOnePresent;	  
	    }
	    
	    $scope.popupMessage = function (number) {
	    	var msg='';
	    	if(number==1){
	    		msg="<p>MMI stands for Maximum Medical Improvement. If an injury to a body part has stabilized and is unlikely to change substantially within the next year (with or without medical treatment), then the injury to that body part has reached MMI, or has become Permanent and Stationary.</p></br><p>A PR-4 report should only be created if one or more of the body parts in the work-related injury has reached MMI. If none of the body parts in this work injury have reached MMI, then a PR-4 report is not yet necessary.</p>";
	    	}else if(number==2)
	    	{
	    		msg="<p>Please provide the date when the injury/condition for this body part reached MMI. In other words, provide the date when the injury/condition of this body part became permanent and stationary.</p></br><p>If you have just determined that the injury/condition for this body part is unlikely to improve (with or without treatment), then enter today’s date.</p>";
	    	}else if(number==3)
	    	{
	    		msg="<p>If you select \"Yes\", then this body part will be included in this PR-4 report and will receive an impairment rating.</p></br><p>If you select \"No\", then this body part will not be included in this PR-4 report, and you can receive an impairment rating for this body part in a future PR-4 report.</p>";
	    	}else if(number==4)
	    	{
	    		msg="<p>You have indicated that this body part should not be included in this report. As a result, this body part will not receive an impairment rating.</p><p>If you want to write a report on this body part, but it has not yet reached MMI, then we suggest writing a Doctor's First report or a PR-2 report.</p><p>If this body part has reached MMI, and you do want an impairment rating for this body part, then go to the Injured Body System(s) section of this report and indicate that the body part has reached MMI.</p>";
	    	}
	    	
		    $rootScope.modalInstance = $modal.open({
	            template: '<div class="modal-header"><button type="button" class="close" aria-hidden="true" ng-click="close()">&times;</button><h3>RateFast</h3></div><div class="modal-body"><div class="login-sign"><h3>'+msg+'</h3></div></div><div class="modal-footer"><button class="btn btn-primary" ng-click="close()">Ok</button></div>',
	            controller: 'popupButtonCtrlclose'
	        });
	    }
	    
	    
	    $scope.changeRateBody = function (radioSelectedBodyPartNum) {
	        debugger;
	      var messge="<h3><p>You are indicating that you do not want to receive an impairment rating for this body part right now. This body part will not be included in this PR-4 report.</p><br><p>If you have updated information for a body part in this report, then that information will be saved, and import into your next report for that body part. However, only information for body parts that you would like to have rated will appear in this report.</p><br><p>If you do not want an impairment rating for this body part right now click \"Confirm\". Otherwise, click \"Cancel\"</p></h3>"
	        $rootScope.modalInstance = $modal.open({
	        	 templateUrl: 'partials/dynamicPopup.html',
		            controller: 'dynamicPopUpCtrl',
	            resolve: {
	            	rdSelectedBodyPartNum: function () {
	                    return radioSelectedBodyPartNum;
	                },
	                confirmButtonText: function () {
	                    return "Confirm";
	                },
	                cancelButtonText: function () {
	                    return "Cancel";
	                },
	                dispalyMessage: function () {
	                    return messge;
	                }
	            }
	        });
	        $rootScope.modalInstance.result.then(function (returndata) {
	            debugger;
	            if (returndata == 'cancel') {
	            	var newdata=$scope.report.data.selectinjuries.sibodypart;
	            	if(newdata.length>=radioSelectedBodyPartNum){
	            		newdata[radioSelectedBodyPartNum].ratebodyYesNoRadio='Yes'
	            	}
	            }
	        }, function (returndata) {
	            debugger;
	           
	        });	        
	    }	    
});


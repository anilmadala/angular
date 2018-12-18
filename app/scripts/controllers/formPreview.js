angular.module('ratefastApp')
    .controller('PreviewCtrl', function ($scope, $modalInstance, $rootScope, formdata, formTitle, saveForm, $validator, $builder, getFormdata, $parse) {

        var templatearray = new Array();
        var templateSectionData = new Array();
        $scope.report = formdata;
        $rootScope.report = formdata;
        $scope.defaultValue = {};
        $scope.formtitles = formTitle[0].title;
        $scope.formVersion = formTitle[0].version;
        $scope.currentsection = $scope.report.sections[0].sectionname;
        $scope.currentsectionId = $scope.report.sections[0].sectiondataid;
        $rootScope.currentsectionId = $scope.report.sections[0].sectiondataid;

        if( typeof $scope.report.data[$scope.currentsectionId] != "object") {
            $scope.report.data[$scope.currentsectionId] = new Object();    
        } 

        if( typeof $scope.defaultValue[$scope.currentsectionId] != "object") { 
            $scope.defaultValue[$scope.currentsectionId] = new Object();                
        }  
        //On loading of preview the below code is set the default Value for checkbox, radio and select2
        for (var i = 0; i < $scope.report.forms[$scope.currentsectionId].length; i++) 
        { 
             //setting default value for radio and select2
            if( $scope.report.forms[$scope.currentsectionId][i] )
            {   
                if ($scope.report.forms[$scope.currentsectionId][i].component == 'radio' || $scope.report.forms[$scope.currentsectionId][i].component == 'select2' || $scope.report.forms[$scope.currentsectionId][i].component == 'select' || $scope.report.forms[$scope.currentsectionId][i].component == 'selectcolors')
                {
                    if($scope.report.forms[$scope.currentsectionId][i].uniqueid)
                    {
                        var uniqueid = $scope.report.forms[$scope.currentsectionId][i].uniqueid;
                        $scope.defaultValue[$scope.currentsectionId][uniqueid] = $scope.report.data[$scope.currentsectionId][uniqueid];
                    }
                }
            }

            //setting default value for radio and select2
            if ($scope.report.forms[$scope.currentsectionId][i].component == 'checkbox')
            {
                var setCheckbox = [];    
                var checkboxValue = [];
                var uniqueid = $scope.report.forms[$scope.currentsectionId][i].uniqueid;
                
                for(var j=0; j < $scope.report.forms[$scope.currentsectionId][i].options.length; j++)
                {
                    if($scope.report.data[$scope.currentsectionId][uniqueid])
                    {
                        checkboxValue = $scope.report.data[$scope.currentsectionId][uniqueid];
                        var checkCondtion = false;
                        for(var k=0; k < checkboxValue.length; k++ )
                        {
                            if( checkboxValue[k] ) { 
                                if( $scope.report.forms[$scope.currentsectionId][i].options[j] == checkboxValue[k].trim() ) {
                                   checkCondtion = true;
                                } 
                            }
                        }
                        setCheckbox.push(checkCondtion);                    
                    } 
                } 
                $scope.defaultValue[$scope.currentsectionId][uniqueid] = setCheckbox;  
            }

        }

        $scope.selectedIndex = 0;
        //$scope.defaultValue[2] = [false, true, true, false];
        $scope.error = false;
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        $scope.currentsectionchange = function (sectionname, index) {
            //if (sectionname.type == "bodypart") { $scope.bodypart = true; } else { $scope.bodypart = false; }
            var d = new Date();
          
            debugger;
            $scope.selectedIndex = index;
            $scope.currentsection = sectionname.sectionname;
            $scope.currentsectionId = sectionname.sectiondataid;
            $scope.currentbodypart = '';
            

            if( typeof $scope.report.data[$scope.currentsectionId] != "object") {
                $scope.report.data[$scope.currentsectionId] = new Object();    
            } 

            if( typeof $scope.defaultValue[$scope.currentsectionId] != "object") { 
                $scope.defaultValue[$scope.currentsectionId] = new Object();                
            }  
            //On loading of preview the below code is set the default Value for checkbox, radio and select2
            for (var i = 0; i < $scope.report.forms[$scope.currentsectionId].length; i++) 
            { 
                 //setting default value for radio and select2
                if( $scope.report.forms[$scope.currentsectionId][i] )
                {   
                    if ($scope.report.forms[$scope.currentsectionId][i].component == 'radio' || $scope.report.forms[$scope.currentsectionId][i].component == 'select2' || $scope.report.forms[$scope.currentsectionId][i].component == 'select' || $scope.report.forms[$scope.currentsectionId][i].component == 'selectcolors')
                    {
                        if($scope.report.forms[$scope.currentsectionId][i].uniqueid)
                        {
                            var uniqueid = $scope.report.forms[$scope.currentsectionId][i].uniqueid;
                            $scope.defaultValue[$scope.currentsectionId][uniqueid] = $scope.report.data[$scope.currentsectionId][uniqueid];
                        }
                    }
                }

                //setting default value for radio and select2
                if ($scope.report.forms[$scope.currentsectionId][i].component == 'checkbox')
                {
                    var setCheckbox = [];    
                    var checkboxValue = [];
                    var uniqueid = $scope.report.forms[$scope.currentsectionId][i].uniqueid;
                    
                    for(var j=0; j < $scope.report.forms[$scope.currentsectionId][i].options.length; j++)
                    {
                        if($scope.report.data[$scope.currentsectionId][uniqueid])
                        {
                            checkboxValue = $scope.report.data[$scope.currentsectionId][uniqueid];
                            var checkCondtion = false;
                            for(var k=0; k < checkboxValue.length; k++ )
                            {
                                if( checkboxValue[k] ) { 
                                    if( $scope.report.forms[$scope.currentsectionId][i].options[j] == checkboxValue[k].trim() ) {
                                       checkCondtion = true;
                                    } 
                                }
                            }
                            setCheckbox.push(checkCondtion);                    
                        } 
                    } 
                    $scope.defaultValue[$scope.currentsectionId][uniqueid] = setCheckbox;  
                }
            }
            
        }


        $scope.setDefaultValues = function (section,bodypartname,index) {

            //Created New Object on template load for storing the data 
            if( typeof $scope.report.data[section.sectiondataid + bodypartname] != "object") {
                $scope.report.data[section.sectiondataid + bodypartname] = new Object();    
            } 
            
            $scope.defaultValue[section.sectiondataid + bodypartname] = new Object();                    
             
            if ($scope.currenttemplatedata.forms[bodypartname]) {
                templatearray.push(section.sectiondataid + bodypartname);                           
                $builder.forms[section.sectiondataid+bodypartname] = $scope.currenttemplatedata.forms[bodypartname];
                              
            } else {
                templatearray.push(section.sectiondataid + bodypartname); 
                $builder.forms[section.sectiondataid + bodypartname] = $scope.currenttemplatedata.forms["other"];
            }

            $scope.bodypart = true;
            $scope.selectedIndex = index;
            $scope.currentsection = section.sectionname;
            $scope.currentbodypart = bodypartname;
            $scope.currentsectionId = section.sectiondataid;

            //set the default Value for checkbox, radio and select2 while loading the template
            if($scope.currenttemplatedata.forms[bodypartname])
            {    
                for (var i = 0; i < $scope.currenttemplatedata.forms[bodypartname].length; i++) 
                {   
                    if( $scope.currenttemplatedata.forms[bodypartname][i].component ) 
                    {
                        //radio and select2    
                        if ($scope.currenttemplatedata.forms[bodypartname][i].component == 'radio' || $scope.currenttemplatedata.forms[bodypartname][i].component == 'select2' || $scope.currenttemplatedata.forms[bodypartname][i].component == 'select' || $scope.report.forms[$scope.currentsectionId][i].component == 'selectcolors')
                        {  
                            if( $scope.currenttemplatedata.forms[bodypartname][i].uniqueid ) {
                                var uniqueid = $scope.currenttemplatedata.forms[bodypartname][i].uniqueid;

                                if( $scope.report.data[$scope.currentsectionId + bodypartname][uniqueid] ) {
                                    $scope.defaultValue[$scope.currentsectionId + bodypartname][uniqueid] = $scope.report.data[$scope.currentsectionId + bodypartname][uniqueid];
                                }
                            }
                        }
                        //Checkbox
                        if ($scope.currenttemplatedata.forms[bodypartname][i].component == 'checkbox') 
                        {
                            var setCheckbox = [];
                            var checkboxValue = [];
                            if( $scope.currenttemplatedata.forms[bodypartname][i] )
                            {   
                                for(var j=0; j < $scope.currenttemplatedata.forms[bodypartname][i].options.length; j++)
                                {      
                                    if( $scope.currenttemplatedata.forms[bodypartname][i].uniqueid) {
                                        var uniqueid = $scope.currenttemplatedata.forms[bodypartname][i].uniqueid;
                                        checkboxValue = $scope.report.data[section.sectiondataid + bodypartname][uniqueid];
                                        var checkCondtion = false;
                                        for(var k=0; k < checkboxValue.length; k++ )
                                        {
                                            if( checkboxValue[k] ) {
                                                if( $scope.currenttemplatedata.forms[bodypartname][i].options[j] == checkboxValue[k].trim() ) {
                                                   
                                                   checkCondtion = true;
                                                } 
                                            }
                                        } 
                                        setCheckbox.push(checkCondtion);
                                    }
                                }
                                
                                if($scope.report.data[section.sectiondataid + bodypartname]) {    
                                    $scope.defaultValue[section.sectiondataid + bodypartname][uniqueid] = setCheckbox; 
                                }
                            }
     
                        }    
                    }
                }
            }
        }

        $scope.gettemplate = function (section, bodypartname, index) {
             
            //Load the template if not exist in the templateSectionData Array    
            if(!templateSectionData[section.template])
            {               
                getFormdata.query({ id: section.template, formtype: 0, version: 0 }).$promise.then(function (responce) {
                    $scope.templatedata = responce[0].dataform;
                    templateSectionData[section.template] = angular.fromJson(responce[0].dataform);
                    $scope.currenttemplatedata = angular.fromJson(responce[0].dataform);
                    //function to Set Values of template from database
                    $scope.setDefaultValues(section,bodypartname,index);
                });
            }     
            else 
            {   //template already exists in the templateSectionData array 
                $scope.currenttemplatedata = templateSectionData[section.template];
                //function to Set Values of template from database
                $scope.setDefaultValues(section,bodypartname,index);
            }
        }

        $scope.gettemplateBodypart = function (section, bodypartname, index) {
            $scope.bodypart = true;
            $scope.selectedIndex = index;
            $scope.currentsection = section.sectionname;
            $scope.currentbodypart = bodypartname;
            $scope.currentsectionId = section.sectiondataid;
        }   

        $scope.clearformData = function () {
            $scope.report.data[$scope.currentsectionId] = new Object();
        }

        // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ Start +++++++++++++++++++++++++++++++
        $scope.submit = function () {
            $validator.validate($scope, $scope.currentsectionId).success(function () {
                return console.log('success');
            }).error(function () {
                return console.log('error');
            });
        };

        $scope.getSection = function (id) {
            if (id) {
                return $scope.$eval(id);
            }

        };

        $scope.validateSection = function (sectionName) {
            $validator.validate($scope, sectionName).success(function () {
                return true;
            }).error(function () {
                return false;
            });

        };


        $scope.visibility = function (section) {

            var result = true;
            
            if (section.visiblity)
                result = $scope.$eval(section.visiblity);
           
            return result;
        }

        // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ End +++++++++++++++++++++++++++++++
    });
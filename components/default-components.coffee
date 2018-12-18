angular.module 'builder.components', ['builder', 'validator.rules']

.config ['$builderProvider', ($builderProvider) ->
    # ----------------------------------------
    # text input
    # ----------------------------------------
    $builderProvider.registerComponent 'textInput',
        group: 'Default'
        label: 'Text Input'
        description: 'description'
        placeholder: 'placeholder'
        required: no
        inline: no
        showcondition: 'showcondition'
        validationOptions: [
            {label: 'none', rule: '/.*/'}
            {label: 'number', rule: '[number]'}
            {label: 'email', rule: '[email]'}
            {label: 'url', rule: '[url]'}
        ]
        template:
            """
            <div class="form-group">
                <label for="{{formName+index}}" class="col-md-4 control-label" ng-class="{'fb-required':required}">{{label}}</label>
                <div class="col-md-8">
                    <input type="text" ng-model="inputText" validator-required="{{required}}" validator-group="{{formName}}" id="{{formName+index}}" class="form-control" placeholder="{{placeholder}}" />
                    <p class='help-block'>{{description}}</p>
                </div>
            </div>
            """
        popoverTemplate:
            """
            <form>
                <div class="form-group">
                    <label class='control-label'>Label</label>
                    <input type='text' ng-model="label" class='form-control'/>
                </div>
                <div class="form-group">
                    <label class='control-label'>UniqueId</label>
                    <input type='text' ng-model="uniqueid" validator="[required]" class='form-control'/>
                </div>
                <div class="form-group">
                    <label class='control-label'>Description</label>
                    <input type='text' ng-model="description" class='form-control'/>
                </div>
                <div class="form-group">
                    <label class='control-label'>Placeholder</label>
                    <input type='text' ng-model="placeholder" class='form-control'/>
                </div>
                <div class="checkbox">
                    <label>
                        <input type='checkbox' ng-model="required" />
                        Required</label>
                </div>
                <div class="checkbox">
                    <label>
                        <input type='checkbox' ng-model="inline" />
                        Inline</label>
                </div>
                <div class="form-group">
                    <label class='control-label'>Class</label>
                    <input type='text' ng-model="class" class='form-control'/>
                </div>
                <div class="form-group">
                    <label class='control-label'>Max Length</label>
                    <input type='text' ng-model="maxLength" class='form-control'/>
                </div>
                <div class="form-group">
                    <label class='control-label'>Condition</label>
                    <input type='text' ng-model="condition" class='form-control'/>
                </div>
                <div class="form-group" ng-if="validationOptions.length > 0">
                    <label class='control-label'>Validation</label>
                    <select ng-model="$parent.validation" class='form-control' ng-options="option.rule as option.label for option in validationOptions"></select>
                </div>

                <hr/>
                <div class='form-group'>
                    <input type='submit' ng-click="popover.save($event)" class='btn btn-primary' value='Save'/>
                    <input type='button' ng-click="popover.cancel($event)" class='btn btn-default' value='Cancel'/>
                    <input type='button' ng-click="popover.remove($event)" class='btn btn-danger' value='Delete'/>
                </div>
            </form>
            """
		templatewithclass:
            """
                <div ng-class="{'clearer': !inline}">
                    <label for="{{formName+index}}" class="col-sm-2" style="padding-top:5px" ng-class="{'fb-required':required}">{{label}}</label>
                    <div class="{{class}}">
                        <input type="text" ng-model="inputText" validator-required="{{required}}" validator-group="{{formName}}" id="{{formName+index}}" class="form-control" placeholder="{{placeholder}}" maxlength="{{maxLength}}"/>
                        <p class='help-block'>{{description}}</p>
                    </div>
                </div>
            """

    # ----------------------------------------
    # Text area
    # ----------------------------------------
    $builderProvider.registerComponent 'textArea',
        group: 'Default'
        label: 'Text Area'
        description: 'description'
        placeholder: 'placeholder'
        required: no
        template:
            """
            <div class="form-group" ng-show="showcondition">
                <label for="{{formName+index}}" class="col-md-4 control-label" ng-class="{'fb-required':required}">{{label}}</label>
                <div class="col-md-8">
                    <textarea type="text" ng-model="inputText" validator-required="{{required}}" validator-group="{{formName}}" id="{{formName+index}}" class="form-control" rows='6' placeholder="{{placeholder}}"/>
                    <p class='help-block'>{{description}}</p>
                </div>
            </div>
            
            """
        popoverTemplate:
            """
            <form>
                <div class="form-group">
                    <label class='control-label'>Label</label>
                    <input type='text' ng-model="label" class='form-control'/>
                </div>
                <div class="form-group">
                    <label class='control-label'>UniqueId</label>
                    <input type='text' ng-model="uniqueid" validator="[required]" class='form-control'/>
                </div>
                <div class="form-group">
                    <label class='control-label'>Description</label>
                    <input type='text' ng-model="description" class='form-control'/>
                </div>
                <div class="form-group">
                    <label class='control-label'>Placeholder</label>
                    <input type='text' ng-model="placeholder" class='form-control'/>
                </div>
                <div class="checkbox">
                    <label>
                        <input type='checkbox' ng-model="required" />
                        Required</label>
                </div>
                <div class="form-group">
                    <label class='control-label'>Max Length</label>
                    <input type='text' ng-model="maxLength" class='form-control'/>
                </div>
                <div class="form-group">
                    <label class='control-label'>Condition</label>
                    <input type='text' ng-model="condition" class='form-control'/>
                </div>
                <hr/>
                <div class='form-group'>
                    <input type='submit' ng-click="popover.save($event)" class='btn btn-primary' value='Save'/>
                    <input type='button' ng-click="popover.cancel($event)" class='btn btn-default' value='Cancel'/>
                    <input type='button' ng-click="popover.remove($event)" class='btn btn-danger' value='Delete'/>
                </div>
            </form>
            """
        templatewithclass:
            """
                <div class="{{class}}">
                    <label for="{{formName+index}}" class="col-sm-2" style="padding-top:15px" ng-class="{'fb-required':required}">{{label}}</label>
                    <div class="col-sm-4 removePadding">
                        <textarea type="text" ng-model="inputText" validator-required="{{required}}" validator-group="{{formName}}" id="{{formName+index}}" class="form-control" rows='6' placeholder="{{placeholder}}" />
                        <p class='help-block'>{{description}}</p>
                    </div>
                </div>
            """

    #-----------------------------------------
    # Datepicker
    #-------------------

        $builderProvider.registerComponent 'datePicker',
        group: 'Default'
        label: 'Datepicker'
        description: 'description'
        placeholder: 'placeholder'
        required: no
        template:
            """
            <div class="form-group">
                <label for="{{formName+index}}" class="col-sm-4" ng-class="{'fb-required':required}">{{label}}</label>
                <div class="col-md-8">
                    <input type="tel" ui-date ng-model="inputText" validator-required="{{required}}" validator-group="{{formName}}" class="form-control" placeholder="{{placeholder}}"/>
                    <p class='help-block'>{{description}}</p>
                </div>
            </div>
            """
        popoverTemplate:
            """
            <form>
                <div class="form-group">
                    <label class='control-label'>Label</label>
                    <input type='text' ng-model="label" class='form-control'/>
                </div>
                <div class="form-group">
                    <label class='control-label'>Uniqueid</label>
                    <input type='text' ng-model="uniqueid" validator="[required]" class='form-control'/>
                </div>
                <div class="form-group">
                    <label class='control-label'>Description</label>
                    <input type='text' ng-model="description" class='form-control'/>
                </div>
                <div class="form-group">    
                    <label class='control-label'>Placeholder</label>
                    <input type='text' ng-model="placeholder" class='form-control'/>
                </div>
                <div class="checkbox">
                    <label>
                        <input type='checkbox' ng-model="required" />
                        Required</label>
                </div>
                <hr/>
                <div class='form-group'>
                    <input type='submit' ng-click="popover.save($event)" class='btn btn-primary' value='Save'/>
                    <input type='button' ng-click="popover.cancel($event)" class='btn btn-default' value='Cancel'/>
                    <input type='button' ng-click="popover.remove($event)" class='btn btn-danger' value='Delete'/>
                </div>
            </form>
            """
        templatewithclass:
            """
                <div ng-class="{'clearer': !inline}">
                    <label for="{{formName+index}}" class="col-sm-2" style="padding-top:7px" ng-class="{'fb-required':required}">{{label}}</label>
                    <div class="{{class}}">
                        <input type="date" ng-model="inputText" validator-required="{{required}}" validator-group="{{formName}}" class="form-control" placeholder="{{placeholder}}" />
                        <p class='help-block'>{{description}}</p>
                    </div>
                </div>
            """

    #----------------------------------------
    # Bodypart
    #----------------------------------------

    $builderProvider.registerComponent 'bodypart',
        group: 'Default'
        label: 'Body Parts'
        description: 'description'
        placeholder: 'placeholder'
        required: false
        options: []
        template:
            """
                <div class="form-group">
                    <label for="{{formName+index}}" class="col-sm-4">{{label}}</label>
                    <div class="col-md-8" style="float:left">
                        <select ng-options="value for value in options" id="{{formName+index}}" class="form-control" ng-model="inputText" />
                        <p class='help-block'>{{description}}</p>
                    </div>
                </div>
            """
        popoverTemplate:
            """
                <form>
                    <div class="form-group">
                        <label class='control-label'>Label</label>
                        <input type='text' ng-model="label" class='form-control'/>
                    </div>
                    <div class="form-group">
                        <label class='control-label'>Uniqueid</label>
                        <input type='text' ng-model="uniqueid" validator="[required]" class='form-control'/>
                    </div>
                    <div class="form-group">
                        <label class='control-label'>Description</label>
                        <input type='text' ng-model="description" class='form-control'/>
                    </div>
                    <div class="form-group">
                        <label class='control-label'>Options</label>
                        <textarea class="form-control" rows="3" ng-model="optionsText" />
                    </div>
                    <div class='form-group'>
                    <input type='submit' ng-click="popover.save($event)" class='btn btn-primary' value='Save'/>
                    <input type='button' ng-click="popover.cancel($event)" class='btn btn-default' value='Cancel'/>
                    <input type='button' ng-click="popover.remove($event)" class='btn btn-danger' value='Delete'/>
                </div>
                </form>
            """
        templatewithclass:
            """
                <div class="form-group" ng-class='{"clearer": !inline}'>
                    <label for='{{formName+index}}' class='col-sm-2' style='padding-top:10px'>{{label}}</label>
                    <div class='col-sm-10 removePadding'>
                    <input type='text' ui-select2="{'multiple': true,'simple_tags': true,'tags':['Neck', 'Mid Back','Low Back','Shoulder-Left','Shoulder-Right','Elbow-Left','Elbow-Right','Wrist-Left','Wrist-Right','Thumb-Left','Thumb-Right','Finger-Index-Left','Finger-Index-Right','Finger-Middle-Left','Finger-Middle-Right','Finger-Ring-Left','Finger-Ring-Right','Finger-Little-Left','Finger-Little-Right','Pelvis/Hip-Left','Pelvis/Hip-Right','Knee-Left','Knee-Right','Ankle/Foot-Left','Ankle/Foot-Right','Toe(s)-Left','Toe(s)-Right','Other']}" ng-model='inputText'  style="width:300px" />
                    <p class="help-block">{{description}}</p>
                </div>
            """
    #----------------------------------------
    # Telephone
    #----------------------------------------

    $builderProvider.registerComponent 'telephone',
        group: 'Default'
        label: 'Telephone'
        description: 'description'
        placeholder: 'placeholder'
        required: false
        template:
            """
                <div class="form-group">
                    <label for="{{formName+index}}" class="col-sm-4" ng-class="{'fb-required':required}">{{label}}</label>
                    <div class="col-md-8">
                        <input type="tel" ui-date ng-model="inputText" validator-required="{{required}}" validator-group="{{formName}}" class="form-control" placeholder="{{placeholder}}" />
                        <p class='help-block'>{{description}}</p>
                    </div>
                </div>
            """
        popoverTemplate:
            """
                <form>
                    <div class="form-group">
                        <label class='control-label'>Label</label>
                        <input type='text' ng-model="label" validator=\"[required]\" class='form-control'/>
                    </div>
                    <div class="form-group">
                        <label class='control-label'>Uniqueid</label>
                        <input type='text' ng-model="uniqueid" validator="[required]" class='form-control'/>
                    </div>
                    <div class="form-group">
                        <label class='control-label'>Description</label>
                        <input type='text' ng-model="description" class='form-control' />
                    </div>
                    <div class="form-group">
                        <label class='control-label'>Placeholder</label>
                        <input type='text' ng-model="placeholder" class='form-control' />
                    </div>
                    <div class="form-group">
                        <label class='control-label'>Class</label>
                        <input type='text' ng-model="class" class='form-control'/>
                    </div>
                    <div class="form-group">
                        <label class='control-label'>Max Length</label>
                        <input type='text' ng-model="maxLength" class='form-control'/>
                    </div>
                    <div class="checkbox">
                        <label><input type='checkbox' ng-model="required" />Required</label>
                    </div>
                    <div class='form-group'>
                        <input type='submit' ng-click="popover.save($event)" class='btn btn-primary' value='Save'/>
                        <input type='button' ng-click="popover.cancel($event)" class='btn btn-default' value='Cancel'/>
                        <input type='button' ng-click="popover.remove($event)" class='btn btn-danger' value='Delete'/>
                    </div>
                </form>
            """
        templatewithclass:
            """
                <div ng-class="{'clearer': !inline}">
                    <label for="{{formName+index}}" class="col-sm-2" style="padding-top:7px" ng-class="{'fb-required':required}">{{label}}</label>
                    <div class="col-sm-4 removePadding">
                        <input type="tel" name="phonenumber" ui-mask="{{y}}" ng-blur="y='(999) 999-9999'" numbers-only="numbers-only" ng-model="inputText" validator-required="{{required}}" validator-group="{{formName}}" class="form-control" placeholder="{{placeholder}}" />
                        <p class='help-block'>{{description}}</p>
                    </div>
                </div>
            """

    #----------------------------------------
    # Label
    #----------------------------------------

        $builderProvider.registerComponent 'inputLabel',
            group: 'Default'
            label: 'Input Label'
            showcondition: 'showcondition'
            template:
                """
                <div class="form-group" ng-show="showcondition">
                    <label for="{{formName+index}}">{{label}}</label>
                </div>
                """
            popoverTemplate:
                """
                <form>
                    <div class="form-group">
                        <label class='control-label'>Label</label>
                        <input type='text' ng-model="label" class='form-control'/>
                    </div>
                    <div class="form-group">
                        <label class='control-label'>Uniqueid</label>
                        <input type='text' ng-model="uniqueid" validator="[required]" class='form-control'/>
                    </div>
                    <div class="form-group">
                        <label class='control-label'>Class</label>
                        <input type='text' ng-model="class" class='form-control'/>
                    </div>
                    <hr/>
                    <div class='form-group'>
                        <input type='submit' ng-click="popover.save($event)" class='btn btn-primary' value='Save'/>
                        <input type='button' ng-click="popover.cancel($event)" class='btn btn-default' value='Cancel'/>
                        <input type='button' ng-click="popover.remove($event)" class='btn btn-danger' value='Delete'/>
                    </div>
                </form>
                """
            templatewithclass:
                """
                    <div ng-class="{'clearer': !inline}">
                        <label for="{{formName+index}}" class="control-label" style="font-weight:bold;">{{label}}</label>
                    </div>
                """

    # ----------------------------------------
    # checkbox
    # ----------------------------------------
    $builderProvider.registerComponent 'checkbox',
        group: 'Default'
        label: 'Checkbox'
        description: 'description'
        placeholder: 'placeholder'
        required: no
        options: ['value one', 'value two']
        arrayToText: true
        template:
            """
            <div class="form-group">
                <label for="{{formName+index}}" class="col-md-4 control-label" ng-class="{'fb-required':required}">{{label}}</label>
                <div class="col-md-8">
                    <input type='hidden' ng-model="inputCheckbox" validator-required="{{required}}" validator-group="{{formName}}"/>
                    <div class='checkbox' ng-repeat="item in options track by $index">
                        <label><input type='checkbox' ng-model="$parent.inputArray[$index]" value='item'/>
                            {{item}}
                        </label>
                    </div>
                    <p class='help-block'>{{description}}</p>
                </div>
            </div>
            """
        popoverTemplate:
            """
            <form>
                <div class="form-group">
                    <label class='control-label'>Label</label>
                    <input type='text' ng-model="label" class='form-control'/>
                </div>
                <div class="form-group">
                    <label class='control-label'>UniqueId</label>
                    <input type='text' ng-model="uniqueid" validator="[required]" class='form-control'/>
                </div>
                <div class="form-group">
                    <label class='control-label'>Description</label>
                    <input type='text' ng-model="description" class='form-control'/>
                </div>
                <div class="form-group">
                    <label class='control-label'>Options</label>
                    <textarea class="form-control" rows="3" ng-model="optionsText"/>
                </div>
                <div class="checkbox">
                    <label>
                        <input type='checkbox' ng-model="required" />
                        Required
                    </label>
                </div>
                <hr/>
                <div class='form-group'>
                    <input type='submit' ng-click="popover.save($event)" class='btn btn-primary' value='Save'/>
                    <input type='button' ng-click="popover.cancel($event)" class='btn btn-default' value='Cancel'/>
                    <input type='button' ng-click="popover.remove($event)" class='btn btn-danger' value='Delete'/>
                </div>
            </form>
            """
        templatewithclass:
            """
                <div ng-class="{'clearer': !inline}">
                    <label for="{{formName+index}}" class="col-md-4 control-label" ng-class="{'fb-required':required}">{{label}}</label>
                    <div class=\"col-md-8\">
                        <input type='hidden' ng-model="inputCheckbox" validator-required="{{required}}" validator-group="{{formName}}" />\
                        <div class='checkbox' ng-repeat=\"item in options track by $index\">
                            <label>
                                <input type='checkbox' ng-model="$parent.inputArray[$index]" ng-true-value="true" ng-false-value="false" value="true" />
                                {{item}}
                            </label>
                        </div>
                        <p class='help-block'>{{description}}</p>
                    </div>
                </div>
            """ 

    # ----------------------------------------
    # radio
    # ----------------------------------------
    $builderProvider.registerComponent 'radio',
        group: 'Default'
        label: 'Radio'
        description: 'description'
        placeholder: 'placeholder'
        required: no
        inline: no
        options: ['value one', 'value two']
        template:
            """
            <div class="form-group">
                <label for="{{formName+index}}" class="col-md-4 control-label" ng-class="{'fb-required':required}">{{label}}</label>
                <div class="col-md-8">
                    <div ng-repeat="item in options track by $index" ng-class="{'fb-inline' : inline}">
                        <input name='{{formName+index}}' ng-model="$parent.inputRadio" validator-group="{{formName}}" value='{{item}}' type='radio'/>
                        {{item}}
                    </div>
                    <p class='help-block'>{{description}}</p>
                </div>
            </div>
            """
        popoverTemplate:
            """
            <form>
                <div class="form-group">
                    <label class='control-label'>Label</label>
                    <input type='text' ng-model="label" class='form-control'/>
                </div>
                <div class="form-group">
                    <label class='control-label'>UniqueId</label>
                    <input type='text' ng-model="uniqueid" class='form-control'/>
                </div>
                <div class="form-group">
                    <label class='control-label'>Description</label>
                    <input type='text' ng-model="description" class='form-control'/>
                </div>
                <div class="form-group">
                    <label class='control-label'>Options</label>
                    <textarea class="form-control" rows="3" ng-model="optionsText"/>
                </div>
				<div class="checkbox">
                    <label>
                        <input type='checkbox' ng-model="inline" />
                        Inline
                    </label>
                </div>
                <hr/>
                <div class='form-group'>
                    <input type='submit' ng-click="popover.save($event)" class='btn btn-primary' value='Save'/>
                    <input type='button' ng-click="popover.cancel($event)" class='btn btn-default' value='Cancel'/>
                    <input type='button' ng-click="popover.remove($event)" class='btn btn-danger' value='Delete'/>
                </div>
            </form>
            """
        templatewithclass:
            """
                <div class="{{class}}">
                    <label for="{{formName+index}}" style="margin-left:20px" ng-class="{'fb-required':required}">{{label}}</label>
                    <div ng-repeat="item in options track by $index" ng-class="{'fb-inline' : inline}">
                        <input name='{{formName+index}}' ng-model="$parent.inputText" validator-group="{{formName}}" value='{{item}}' type='radio' />
                        {{item}}
                    </div>
                    <p class='help-block'>{{description}}</p>
                </div>
            """
    

    # ----------------------------------------
    # select
    # ----------------------------------------
    $builderProvider.registerComponent 'select',
        group: 'Default'
        label: 'Select'
        description: 'description'
        placeholder: 'placeholder'
        required: no
        options: ['value one', 'value two']
        template:
            """
            <div class="form-group">
                <label for="{{formName+index}}" class="col-md-4 control-label">{{label}}</label>
                <div class="col-md-8">
                    <select ng-options="value for value in options" id="{{formName+index}}" class="form-control" ng-model="inputText" ng-init="inputText = options[0]"/>
                    <p class='help-block'>{{description}}</p>
                </div>
            </div>
            """
        popoverTemplate:
            """
            <form>
                <div class="form-group">
                    <label class='control-label'>Label</label>
                    <input type='text' ng-model="label" class='form-control'/>
                </div>
                <div class="form-group">
                    <label class='control-label'>UniqueId</label>
                    <input type='text' ng-model="label" class='form-control'/>
                </div>
                <div class="form-group">
                    <label class='control-label'>Description</label>
                    <input type='text' ng-model="description" class='form-control'/>
                </div>
                <div class="form-group">
                    <label class='control-label'>Options</label>
                    <textarea class="form-control" rows="3" ng-model="optionsText"/>
                </div>
                <hr/>
                <div class='form-group'>
                    <input type='submit' ng-click="popover.save($event)" class='btn btn-primary' value='Save'/>
                    <input type='button' ng-click="popover.cancel($event)" class='btn btn-default' value='Cancel'/>
                    <input type='button' ng-click="popover.remove($event)" class='btn btn-danger' value='Delete'/>
                </div>
            </form>
            """
        templatewithclass:
            """
                <div ng-class="{'clearer': !inline}">
                    <label for="{{formName+index}}" class="col-sm-2" style="padding-top:10px">{{label}}</label>
                    <div class="col-sm-4 removePadding">
                        <select ng-options="value for value in options" id="{{formName+index}}" class="form-control" ng-model="inputText" ng-init="inputText = options[0]" />
                        <p class='help-block'>{{description}}</p>
                    </div>
                </div>
            """

    # ----------------------------------------
    # Text area
    # ----------------------------------------
    $builderProvider.registerComponent 'textareaEditor',
        group: 'Default'
        label: 'Text Area Editor'
        description: 'description'
        placeholder: 'placeholder'
        required: no
        template:
            """
            <div class="form-group" ng-show="showcondition">
                <label for="{{formName+index}}" class="col-md-4 control-label" ng-class="{'fb-required':required}">{{label}}</label>
                <div class="col-md-8">
                    <textarea type="text" ng-model="inputText" validator-required="{{required}}" validator-group="{{formName}}" id="{{formName+index}}" class="form-control" rows='6' placeholder="{{placeholder}}"/>
                    <p class='help-block'>{{description}}</p>
                </div>
            </div>
            
            """
        popoverTemplate:
            """
            <form>
                <div class="form-group">
                    <label class='control-label'>Label</label>
                    <input type='text' ng-model="label" class='form-control'/>
                </div>
                <div class="form-group">
                    <label class='control-label'>UniqueId</label>
                    <input type='text' ng-model="uniqueid" validator="[required]" class='form-control'/>
                </div>
                <div class="form-group">
                    <label class='control-label'>Description</label>
                    <input type='text' ng-model="description" class='form-control'/>
                </div>
                <div class="form-group">
                    <label class='control-label'>Placeholder</label>
                    <input type='text' ng-model="placeholder" class='form-control'/>
                </div>
                <div class="checkbox">
                    <label>
                        <input type='checkbox' ng-model="required" />
                        Required</label>
                </div>
                <div class="form-group">
                    <label class='control-label'>Max Length</label>
                    <input type='text' ng-model="maxLength" class='form-control'/>
                </div>
                <div class="form-group">
                    <label class='control-label'>Condition</label>
                    <input type='text' ng-model="condition" class='form-control'/>
                </div>
                <hr/>
                <div class='form-group'>
                    <input type='submit' ng-click="popover.save($event)" class='btn btn-primary' value='Save'/>
                    <input type='button' ng-click="popover.cancel($event)" class='btn btn-default' value='Cancel'/>
                    <input type='button' ng-click="popover.remove($event)" class='btn btn-danger' value='Delete'/>
                </div>
            </form>
            """
        templatewithclass:
            """
                <div class="{{class}}">
                    <label for="{{formName+index}}" class="col-sm-2" style="padding-top:15px" ng-class="{'fb-required':required}">{{label}}</label>
                    <div class="col-sm-4 removePadding">
                        <textarea ui-tinymce ng-model="inputText" validator-required="{{required}}" validator-group="{{formName}}" id="{{formName+index}}" class="form-control" rows='6' placeholder="{{placeholder}}"></textarea>
                        <p class='help-block'>{{description}}</p>
                    </div>
                </div>
            """
]

/*
 * European Variation Archive (EVA) - Open-access database of all types of genetic
 * variation data from all species
 *
 * Copyright 2014, 2015 EMBL - European Bioinformatics Institute
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function SpeciesFilterFormPanel(args) {
    _.extend(this, Backbone.Events);

    //set default args
    this.id = Utils.genId("SpeciesFilterFormPanel");
    this.target;
    this.autoRender = true;
    this.title = "Genome Assembly";
    this.border = false;
    this.collapsible = true;
    this.titleCollapse = false;
    this.headerConfig;
    this.defaultValue = EvaVariantWidgetPanel.defaultSpecies;

    //set instantiation args, must be last
    _.extend(this, args);

    this.on(this.handlers);

    this.rendered = false;
    if (this.autoRender) {
        this.render(this.targetId);
    }
}

SpeciesFilterFormPanel.prototype = {
    render: function () {
        var _this = this;
        console.log("Initializing " + this.id);
        //HTML skel
        this.div = document.createElement('div');
        this.div.setAttribute('id', this.id);

        this.panel = this._createPanel();
    },
    draw: function () {
        this.targetDiv = (this.target instanceof HTMLElement ) ? this.target : document.querySelector('#' + this.target);
        if (!this.targetDiv) {
            console.log('target not found');
            return;
        }
        this.targetDiv.appendChild(this.div);

        this.panel.render(this.div);
    },
    _createPanel: function () {
        var _this = this;

        Ext.define('SpeciesListModel', {
            extend: 'Ext.data.Model',
            fields: [
                {name: 'taxonomyCommonName', type: 'string'},
                {name: 'taxonomyCode', type: 'string'},
                {name: 'assemblyName', type: 'string'},
                {name: 'assemblyCode', type: 'string'},
                {
                    name: 'displayName',
                    type: 'string',
                    convert: function (v, record) {
                        if (record.get('taxonomyEvaName')) {
                            return record.get('taxonomyEvaName').substr(0, 1).toUpperCase() + record.get('taxonomyEvaName').substr(1) + ' / ' + record.get('assemblyName')
                        }
                    }
                },
                {
                    name: 'value',
                    type: 'string',
                    convert: function (v, record) {
                        if (record.get('taxonomyCode')) {
                            return record.get('taxonomyCode') + '_' + record.get('assemblyCode')
                        }
                    }
                }
            ]
        });

        var speciesStore = Ext.create('Ext.data.Store', {
            model: 'SpeciesListModel',
            data: deDuplicatedSpeciesList(_this.speciesList),
            sorters: [
                {
                    property: 'taxonomyEvaName',
                    transform: function(value) {return value.toLowerCase();},
                    direction: 'ASC'
                }
            ]
        });

        var speciesFormField = Ext.create('Ext.form.ComboBox', {
            fieldLabel: 'Organism / Assembly',
            id: "speciesFilter",
            name: 'species',
            labelAlign: 'top',
            store: speciesStore,
            queryMode: 'local',
            displayField: 'displayName',
            valueField: 'value',
            width: '100%',
            editable: false,
            listeners: {
                afterrender: function (field) {
                    field.setValue(_this.defaultValue);
                },
                change: function (field, newValue, oldValue) {
                   if (newValue) {
                       _this.trigger('species:change', {species: newValue, sender: _this});
                   }
                }
            }
        });

        return Ext.create('Ext.form.Panel', {
            bodyPadding: "5",
            margin: "0 0 5 0",
            buttonAlign: 'center',
            layout: 'vbox',
            title: this.title,
            border: this.border,
            collapsible: this.collapsible,
            titleCollapse: this.titleCollapse,
            header: this.headerConfig,
            allowBlank: false,
            items: [speciesFormField]
        });

    },
    getPanel: function () {
        return this.panel;
    },
    getValues: function () {
        var values = this.panel.getValues();
        for (key in values) {
            if (values[key] == '') {
                delete values[key]
            }
        }
        return values;
    },
    clear: function () {
        this.panel.reset();
    }
}

// @ts-nocheck
/* eslint-disable no-undef */

sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageToast",
    "sap/m/Label",
    "sap/m/ColumnListItem",
    "sap/m/Column",
    "sap/m/Table"
],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel
     * @param {typeof sap.ui.model.Filter} Filter
     * @param {typeof sap.ui.model.FilterOperator} FilterOperator
     * @param {typeof sap.m.MessageToast} MessageToast
     * @param {typeof sap.m.Label} Label
     * @param {typeof sap.m.ColumnListItem} ColumnListItem
     * @param {typeof sap.m.Column} Column
     * @param {typeof sap.m.Table} Table
     */
    function (Controller, JSONModel, Filter, FilterOperator, MessageToast, Label, ColumnListItem, Column, Table) {
        "use strict";
        function onInit() {
            this._bus = sap.ui.getCore().getEventBus();
        };

        function onFilter() {

            var oJSONCountries = this.getView().getModel("jsonCountries").getData();
            var filters = [];

            if (oJSONCountries.EmployeeId !== "") {
                filters.push(new Filter("EmployeeID", FilterOperator.EQ, oJSONCountries.EmployeeId));
            };

            if (oJSONCountries.CountryKey !== "") {
                filters.push(new Filter("Country", FilterOperator.EQ, oJSONCountries.CountryKey));
            };

            var oList = this.getView().byId("tableEmployee");
            var oBinding = oList.getBinding("items");
            oBinding.filter(filters);

        };

        function onClearFilter() {

            var oModel = this.getView().getModel("jsonCountries");
            oModel.setProperty("/EmployeeId", "");
            oModel.setProperty("/CountryKey", "");

        };

        function showPostalCode(oEvent) {

            var itemPressed = oEvent.getSource();
            var oContext = itemPressed.getBindingContext("odataNorthwind");
            var objectContext = oContext.getObject();

            MessageToast.show(objectContext.PostalCode);

        };

        function onShowCity() {
            var oJSONModelConfig = this.getView().getModel("jsonModelConfig");
            oJSONModelConfig.setProperty("/visibleCity", true);
            oJSONModelConfig.setProperty("/visibleBtnShowCity", false);
            oJSONModelConfig.setProperty("/visibleBtnHideCity", true);
        };

        function onHideCity() {
            var oJSONModelConfig = this.getView().getModel("jsonModelConfig");
            oJSONModelConfig.setProperty("/visibleCity", false);
            oJSONModelConfig.setProperty("/visibleBtnShowCity", true);
            oJSONModelConfig.setProperty("/visibleBtnHideCity", false);
        };

        function showOrder(oEvent){
            
            //Get selected Controller
            var iconPressed = oEvent.getSource();

            //Context from the model
            var oContext = iconPressed.getBindingContext("odataNorthwind");

            //_oDialogOrder es una variable
            if(!this._oDialogOrder){
                this._oDialogOrder = sap.ui.xmlfragment("logaligroup.Employees.fragments.DialogOrders", this);
                this.getView().addDependent(this._oDialogOrder);
            }

            //Dialog binding to the context to have access to the data of selected item
            this._oDialogOrder.bindElement("odataNorthwind>" + oContext.getPath());
            this._oDialogOrder.open();

        };

        function onCloseOrders() {
            this._oDialogOrder.close();
        };

        function showEmployee(oEvent) {
            var path = oEvent.getSource().getBindingContext("odataNorthwind").getPath();
            this._bus.publish("flexible", "showEmployee", path)
        }

        var Main = Controller.extend("logaligroup.Employees.controller.MasterEmployee", {});

        Main.prototype.onValidate = function () {

            var inputEmployee = this.byId("inputEmployee");
            var valueEmployee = inputEmployee.getValue();

            if (valueEmployee.length === 6) {
                //inputEmployee.setDescription("OK");
                this.byId("labelCountry").setVisible(true);
                this.byId("selCountry").setVisible(true);
            } else {
                //inputEmployee.setDescription("Not OK");
                this.byId("labelCountry").setVisible(false);
                this.byId("selCountry").setVisible(false);
            }
        };

        Main.prototype.onInit = onInit;
        Main.prototype.onFilter = onFilter;
        Main.prototype.onClearFilter = onClearFilter;
        Main.prototype.showPostalCode = showPostalCode;
        Main.prototype.onShowCity = onShowCity;
        Main.prototype.onHideCity = onHideCity;
        Main.prototype.showOrder = showOrder;
        Main.prototype.onCloseOrders = onCloseOrders;
        Main.prototype.showEmployee = showEmployee;

        return Main;

    });

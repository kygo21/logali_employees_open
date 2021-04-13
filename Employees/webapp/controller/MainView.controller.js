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
     * @param {typeof sap.m.MessageToast} MessageToast
     * @param {typeof sap.m.Label} Label
     * @param {typeof sap.m.ColumnListItem} ColumnListItem
     * @param {typeof sap.m.Column} Column
     * @param {typeof sap.m.Table} Table
     */
    function (Controller, JSONModel, Filter, FilterOperator, MessageToast, Label, ColumnListItem, Column, Table) {
        "use strict";
        function onInit() {


            var oView = this.getView();
            //var i18nBundle = oView.getModel("i18n").getResourceBundle();

            var oJSONModelEmpleado = new JSONModel();
            oJSONModelEmpleado.loadData("./localService/mockdata/Employees.json", false);
            oView.setModel(oJSONModelEmpleado, "jsonEmployees");

            var oJSONModelCountries = new JSONModel();
            oJSONModelCountries.loadData("./localService/mockdata/Countries.json", false);
            oView.setModel(oJSONModelCountries, "jsonCountries");

            var oJSONModelConfig = new JSONModel({
                visibleID: true,
                visibleName: true,
                visibleCountry: true,
                visibleCity: false,
                visibleBtnShowCity: true,
                visibleBtnHideCity: false
            });

            oView.setModel(oJSONModelConfig, "jsonModelConfig");

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
            var oContext = itemPressed.getBindingContext("jsonEmployees");
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
            
            var ordersTable = this.getView().byId("ordersTable");
            ordersTable.destroyItems();

            var itemPressed = oEvent.getSource();
            var oContext = itemPressed.getBindingContext("jsonEmployees");

            var objectContext = oContext.getObject();
            var orders = objectContext.Orders;

            var ordersItems = [];

            for(var i in orders){
                ordersItems.push(new ColumnListItem({
                    cells:[
                        new Label({ text: orders[i].OrderID }),
                        new Label({ text: orders[i].Freight }),
                        new Label({ text: orders[i].ShipAddress })
                    ]
                }));
            };

            var newTable = new Table({
                width: "auto",
                columns: [
                    new Column({header : new Label({text : "{i18n>orderID}"}) }),
                    new Column({header : new Label({text : "{i18n>freight}"}) }),
                    new Column({header : new Label({text : "{i18n>shipAddress}"}) }),
                ],
                items: ordersItems
            }).addStyleClass("sapUiSmallMargin");

            ordersTable.addItem(newTable);


            //Creación de una nueva tabla 

            var newTableJSON = new Table();
            newTableJSON.setWidth("auto");
            newTableJSON.addStyleClass("sapUiSmallMargin");

            var columnOrderID = new Column();
            var labelOrderID = new Label();
            labelOrderID.bindProperty("text", "i18n>orderID");
            columnOrderID.setHeader(labelOrderID);
            newTableJSON.addColumn(columnOrderID);

            var columnFreight = new Column();
            var labelFreight = new Label();
            labelFreight.bindProperty("text", "i18n>freight");
            columnFreight.setHeader(labelFreight);
            newTableJSON.addColumn(columnFreight);

            var columnShipAddress = new Column();
            var labelShipAddress = new Label();
            labelShipAddress.bindProperty("text", "i18n>orderID");
            columnShipAddress.setHeader(labelShipAddress);
            newTableJSON.addColumn(columnShipAddress);

            var columnListItem = new ColumnListItem();

            var cellOrderID = new Label();
            cellOrderID.bindProperty("text", "jsonEmployees>OrderID");
            columnListItem.addCell(cellOrderID);

            var cellFreight = new Label();
            cellFreight.bindProperty("text", "jsonEmployees>Freight");
            columnListItem.addCell(cellFreight);

            var cellShipAddress = new Label();
            cellShipAddress.bindProperty("text", "jsonEmployees>ShipAddress");
            columnListItem.addCell(cellShipAddress);

            var oBindingInfo = {
                model: "jsonEmployees",
                path: "Orders",
                template: columnListItem
            };

            //Se pasa todos los elementos a la instancia de la tabla
            newTableJSON.bindAggregation("items", oBindingInfo);
            newTableJSON.bindElement("jsonEmployees>"+oContext.getPath());
            
            ordersTable.addItem(newTableJSON);

        };

        var Main = Controller.extend("logaligroup.Employees.controller.MainView", {});

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

        return Main;

    });

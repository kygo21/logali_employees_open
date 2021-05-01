// @ts-nocheck
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel
     * @param {typeof sap.m.MessageToast} MessageToast
     */
    function (Controller, JSONModel, MessageToast) {

        return Controller.extend("logaligroup.Employees.controller.Main", {

            //Este metodo se llama antes de renderizar la vista
            onBeforeRendering: function () {
                //Se obtiene el valor para poderlo usar en otros puntos
                this._detailEmployeeView = this.getView().byId("detailEmployeeView");
            },

            onInit: function () {

                var oView = this.getView();
                //var i18nBundle = oView.getModel("i18n").getResourceBundle();

                var oJSONModelEmpleado = new JSONModel();
                oJSONModelEmpleado.loadData("./localService/mockdata/Employees.json", false);
                oView.setModel(oJSONModelEmpleado, "jsonEmployees");

                var oJSONModelCountries = new JSONModel();
                oJSONModelCountries.loadData("./localService/mockdata/Countries.json", false);
                oView.setModel(oJSONModelCountries, "jsonCountries");

                var oJSONModelLayout = new JSONModel();
                oJSONModelLayout.loadData("./localService/mockdata/Layout.json", false);
                oView.setModel(oJSONModelLayout, "jsonLayout");

                var oJSONModelConfig = new JSONModel({
                    visibleID: true,
                    visibleName: true,
                    visibleCountry: true,
                    visibleCity: false,
                    visibleBtnShowCity: true,
                    visibleBtnHideCity: false
                });

                oView.setModel(oJSONModelConfig, "jsonModelConfig");

                this._bus = sap.ui.getCore().getEventBus();
                this._bus.subscribe("flexible", "showEmployee", this.showEmployeeDetails, this);
                //Se hace la subscripción al evento
                this._bus.subscribe("incidence", "onSaveIncidence", this.onSaveODataIncidence, this);

            },

            showEmployeeDetails: function (category, nameEvent, path) {
                var detailView = this.getView().byId("detailEmployeeView");
                detailView.bindElement("odataNorthwind>" + path);
                this.getView().getModel("jsonLayout").setProperty("/ActiveKey", "TwoColumnsMidExpanded");

                var incidentModel = new JSONModel([]);
                detailView.setModel(incidentModel, "incidenceModel");
                detailView.byId("tableIncidence").removeAllContent();
            },

            onSaveODataIncidence: function (channelId, eventId, data) {
                //Obtenemos el bundle del modelo i18n
                var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
                //Obtenmos el valor del employeeId para poder relacionarlo a la incidencia
                var employeeId = this._detailEmployeeView.getBindingContext("odataNorthwind").getObject().EmployeeID;
                //Obtenemos las incidencias creadas asociadas al modelo
                var incidenceModel = this._detailEmployeeView.getModel("incidenceModel").getData();

                var incidenceCreateModel = this.getView().getModel("incidenceModel");

                //Armamos el cuerpo del json a enviar para el oData
                //SapId: Se obtiene de la variable global que se definió en el Component.js
                //Los demás campos se obtiene del incidenceModel y especificando su indice que viene deta.incidenceRow
                var bodyOdata = {
                    SapId: this.getOwnerComponent().SapId,
                    EmployeeId: employeeId.toString(),
                    CreationDate: incidenceModel[data.incidenceRow].CreationDate,
                    Type: incidenceModel[data.incidenceRow].Type,
                    Reason: incidenceModel[data.incidenceRow].Reason
                };

                //Sólo creamos cuando no tenga asignado un id
                if (typeof incidenceModel[data.incidenceRow].IncidenceId == 'undefined') {

                    //Hacemos la llamada al OData
                    //bind(this) La llamada sepa en que contexto se llamó
                    this.getView().getModel("incidenceModel").create("/IncidenceSet", bodyOdata, {
                        success: function () {
                            MessageToast.show(oResourceBundle.getText("odataSaveOK"));
                        }.bind(this),
                        error: function (e) {
                            MessageToast.show(oResourceBundle.getText("odataSaveKO"));
                        }.bind(this)
                    });
                }else{
                    MessageToast(oResourceBundle.getText("odataNoChanges"));
                }
            }

        });
    });
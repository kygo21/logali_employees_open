// @ts-nocheck
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "logaligroup/Employees/model/formatter"
], 
/**
 * @param {typeof sap.ui.core.mvc.Controller} Controller
 */
function(Controller, formatter){

    function onInit(){
        //Esto se utiliza para levantar el evento al momento de dar click en los botones del CRUD
        this._bus = sap.ui.getCore().getEventBus();
    };

    function onCreateIncidence(){
        
        var tableIncidence = this.getView().byId("tableIncidence");
        var newIncidence = sap.ui.xmlfragment("logaligroup.Employees.fragments.NewIncidence", this);
        var incidenceModel = this.getView().getModel("incidenceModel");
        var oData = incidenceModel.getData();
        var index = oData.length;
        oData.push({ index : index + 1 });
        incidenceModel.refresh();
        newIncidence.bindElement("incidenceModel>/" + index);
        tableIncidence.addContent(newIncidence);

    };

    function onDeleteIncidence(oEvent){

        var tableIncidence = this.getView().byId("tableIncidence");
        var rowIncidence = oEvent.getSource().getParent().getParent();
        var incidenceModel = this.getView().getModel("incidenceModel");
        var odata = incidenceModel.getData();
        var contextObj = rowIncidence.getBindingContext("incidenceModel");

        odata.splice(contextObj.index-1,1);

        for(var i in odata){
            odata[i].index = parseInt(i) + 1;
        };

        incidenceModel.refresh();

        tableIncidence.removeContent(rowIncidence);

        for(var j in tableIncidence.getContent()){
            tableIncidence.getContent()[j].bindElement("incidenceModel>/"+j);
        }

    };

    function onSaveIncidence(oEvent){
        //Saber cual es la línea de la incidencia seleccionada
        var incidence = oEvent.getSource().getParent().getParent();
        //Obtenemos el modelo de la linea seleccionada
        var rowIncidence = incidence.getBindingContext("incidenceModel");
        //Obtenemos el indice de la incidencia seleccionada y obtenemos el valor sin el /
        var indexIncidence = rowIncidence.sPath.replace('/','');
        //pasamos al handler la susbcripción del evento
        this._bus.publish("incidence", "onSaveIncidence", { incidenceRow: indexIncidence });
    };

    var EmployeeDetailsMain = Controller.extend("logaligroup.Employees.controller.EmployeeDetails", {} );

    EmployeeDetailsMain.prototype.onInit = onInit;
    EmployeeDetailsMain.prototype.onCreateIncidence = onCreateIncidence;
    EmployeeDetailsMain.prototype.Formatter = formatter;
    EmployeeDetailsMain.prototype.onDeleteIncidence = onDeleteIncidence;
    EmployeeDetailsMain.prototype.onSaveIncidence = onSaveIncidence;

    return EmployeeDetailsMain;
});
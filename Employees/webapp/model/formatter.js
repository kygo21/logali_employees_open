sap.ui.define([
    "sap/ui/core/format/DateFormat"
], 
/**
 * @param typeof {sap.ui.core.format.DateFormat} DateFormat
 */
function(DateFormat){

    function dateFormat(date){

        var timeDay = 24 * 60 * 60 * 1000;

        if(date){
            var dateNow = new Date();
            var dateFormat = DateFormat.getDateInstance({pattern : "yyyy/MM/dd"});
            var dateNowFormat = new Date(dateFormat.format(dateNow));

            var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();

            switch(true){
                //Today
                case date.getTime() === dateNowFormat.getTime():
                    return oResourceBundle.getText("textToday");
                
                //Yesterday
                case date.getTime() === dateNowFormat.getTime() - timeDay:
                    return oResourceBundle.getText("textYesterday");

                //Tomorrow    
                case date.getTime() === dateNowFormat.getTime() + timeDay:
                    return oResourceBundle.getText("textTomorrow");
                
                default :
                    return "";
                
            }

        }

    }

    return {
        dateFormat: dateFormat
    }

});
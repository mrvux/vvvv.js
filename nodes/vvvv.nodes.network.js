
VVVV.Nodes.HTTPGet = function(id, graph) {
  this.constructor(id, "HTTP (Network Get)", graph);
  
  var urlIn = this.addInputPin("URL", ["http://localhost"], this);
  var nameIn = this.addInputPin("Name", [""], this);
  var valueIn = this.addInputPin("Value", [""], this);
  var refreshIn = this.addInputPin("Refresh", [0], this);
  
  var statusOut = this.addOutputPin("Status", [""], this);
  var bodyOut = this.addOutputPin("Body", [""], this);
  var failOut = this.addOutputPin("Fail", [0], this);
  var successOut = this.addOutputPin("Success", [0], this);
  
  var body;
  var status;
  var success;
  var fail;
  
  var requestComplete = false;
  
  var doResetOutPins = -1;

  this.evaluate = function() {
    var maxSize = this.getMaxInputSliceCount();
    
    var pinsChanged = urlIn.pinIsChanged() || nameIn.pinIsChanged() || valueIn.pinIsChanged() || (refreshIn.pinIsChanged() && refreshIn.getValue(0)==1);
    
    if (successOut.getValue(0)==1)
      successOut.setValue(0,0);
    if (failOut.getValue(0)==1)
      failOut.setValue(0, 0);
    
    if (requestComplete) {
      bodyOut.setValue(0, body);
      statusOut.setValue(0, status);
      successOut.setValue(0, success);
      failOut.setValue(0, fail);
      requestComplete = false;
    }
    
    if (pinsChanged) {
      var i = 0;
      if (urlIn.getValue(i)==undefined) {
        bodyOut.setValue(0, '');
        statusOut.setValue(0, '');
        return;
      }
      $.ajax({
        url: urlIn.getValue(i),
        type: 'get',
        success: function(response, status, xhr) {
          body = response;
          status = xhr.status;
          success = 1;
          requestComplete = true;
        },
        error: function(xhr, status) {
          body = '';
          fail = 1;
          status = xhr.status;
          requestComplete = true;
        }
      });
    }
  }

}
VVVV.Nodes.HTTPGet.prototype = new VVVV.Core.Node();
/*var networkInfo = {
	estaConectado: function(){
		if(navigator.connection.type != Connection.NONE){
			return true;
		}
		return false;
	}
};
*/
var networkState = {
estaConectado: function(){
 
    if (navigator.connection.type !== Connection.NONE) {
            return true;
        }
		return false;
    }
};
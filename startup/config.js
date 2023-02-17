import config from 'config'
export default function(){

if(!config.get('jwtPrivateKey')){
    throw new Error("FatalError:jwtPrivateKey not defined");
    
}
}
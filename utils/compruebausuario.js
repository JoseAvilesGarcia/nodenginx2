const md5 = require('md5');

const compruebaUsuarios = {
     getAutoriza(usuario, password) {
        //Calamarcalamar
        if (md5(`${usuario}${password}`) !== '04bfd8c3495ca9df2003dca1906c8673')
        {
            return false;
        }
        
        return true;
  },
};

module.exports = compruebaUsuarios;

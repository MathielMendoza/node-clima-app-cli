require('dotenv').config();

const {pausa, inquirerMenu, leerInput, listarLugares} = require('./src/helpers/inquirer');
const Busquedas = require('./src/models/busquedas');

const main = async () => {
    const busquedas = new Busquedas;
    let opt;

    do {
        opt = await inquirerMenu();
        switch (opt) {
            case 1:
                //Mostar mensaje
                const terminobusqueda = await leerInput('Ciudad: ');

                //Buscar los lugares
                const lugares = await busquedas.ciudad(terminobusqueda)

                //Seleccionar el lugar
                const id = await listarLugares(lugares);
                if (id === '0') continue;

                const lugarSel = lugares.find(l => l.id === id)

                //Guardar en DB
                busquedas.agregarHistorial(lugarSel.nombre)

                //clima
                const clima = await busquedas.climaLugar(lugarSel.lat, lugarSel.lng)

                //Mostrar resultados
                console.clear();
                console.log('\nInformación de la ciudad\n'.green);
                console.log('Ciudad:', lugarSel.nombre.green);
                console.log('Lat:', lugarSel.lat);
                console.log('Lng:', lugarSel.lng);
                console.log('Temperatura:', clima.temp);
                console.log('Mínima:', clima.min);
                console.log('Máxima:', clima.max);
                console.log('Como está el clima:', clima.desc.green);

                break
            case 2:
                busquedas.gethistorialCapitalizado().forEach((lugar, i) => {
                    const idx = `${i + 1}.`.green;
                    console.log(`${idx} ${lugar}`)
                })
                break
            case 3:

                break

        }

        if (opt !== 0) await pausa();
    } while (opt !== 0)
}

main();
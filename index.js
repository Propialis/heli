import * as THREE from 'three';
import metaversefile from 'metaversefile';
import { Vector3 } from 'three';

const {useApp, useFrame, useLoaders, usePhysics, useCleanup, useLocalPlayer, useActivate} = metaversefile;

const baseUrl = import.meta.url.replace(/(\/)[^\/\/]*$/, '$1'); 

const localVector = new THREE.Vector3();
const localVector2 = new THREE.Vector3();
const localVector3 = new THREE.Vector3();
const localVector4 = new THREE.Vector3();
const localVector5 = new THREE.Vector3();
const localQuaternion = new THREE.Quaternion();
const localQuaternion2 = new THREE.Quaternion();
const localQuaternion3 = new THREE.Quaternion();
const localEuler = new THREE.Euler();
const localMatrix = new THREE.Matrix4();
window.isDebug = false


export default () => {  

    const app = useApp();
    window.heli = app
    const physics = usePhysics();
    window.physics = physics;
    const physicsIds = [];
    const localPlayer = useLocalPlayer();

    let vehicleObj;

    let vehicle = null;

    const loadModel = ( params ) => {

        return new Promise( ( resolve, reject ) => {
                
            const { gltfLoader } = useLoaders();
            gltfLoader.load( params.filePath + params.fileName, function( gltf ) {
                resolve( gltf.scene );     
            });
        })
    }

    let p1 = loadModel( { filePath: baseUrl, fileName: 'flying-machine.glb', pos: { x: 0, y: 0, z: 0 } } ).then( result => { vehicleObj = result } );

    let loadPromisesArr = [ p1 ];

    Promise.all( loadPromisesArr ).then( models => {

        app.add( vehicleObj );

        const physicsId = physics.addBoxGeometry(
          new THREE.Vector3(0, 0.5, 0),
          new THREE.Quaternion(),
          new THREE.Vector3(0.6, 0.4, 1.5),
          true
        );
        physicsIds.push(physicsId);

        vehicle = app.physicsObjects[0];
        window.vehicle = vehicle; // test
        vehicle.detached = true;
    });

    useFrame(( { timeDiff } ) => {

      if(app && vehicle) {
        //Applying physics transform to app
        app.position.copy(vehicle.position);
        app.quaternion.copy(vehicle.quaternion);
        app.updateMatrixWorld();
      }

    });

    useCleanup(() => {
      for (const physicsId of physicsIds) {
       physics.removeGeometry(physicsId);
      }
      _unwear();
    });

    return app;
}

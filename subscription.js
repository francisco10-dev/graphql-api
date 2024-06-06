import webPush from 'web-push';

const apiKeys = {
    publicKey: 'BIze4x_-5Nn3IuaVockuL5f-IY_wENsDE-Vhtdwg6UckIF5hKN5zyTCEtBlBT5rFXEw3aSSkEplX1Va92GW8mg4',
    privateKey: '7V6E8__csB8ldCTfschXm9HotqiXy1leAtEBITGdro4'
};

webPush.setVapidDetails(
    'mailto:ortizjose451@gmail.com',
    apiKeys.publicKey,
    apiKeys.privateKey
);

const subDatabse = [];

export const saveSubscripcion = async (req, res) => {
    console.log('->');
    //subDatabse.push(req.body);
    const newSubscription = req.body;
    const exists = subDatabse.some(sub => sub.endpoint === newSubscription.endpoint);

    if (!exists) {
        subDatabse.push(newSubscription);
    }

    res.json({ 
        status: "200",
        message: "Subscripción guardada" 
    });
};


export async function sendNotification(task){
    subDatabse.forEach(subscription => {
        webPush.sendNotification(subscription, JSON.stringify({
            title: 'Nueva Tarea',
            body: `Se ha creado una nueva tarea: ${task.name}`,
        }));
    });
};


import { database } from "./config.js";
import { ref, child, get, push, set } from "firebase/database";

export async function readData(path) {
    return await get(child(ref(database), path))
        .then((snapshot) => {
            if (snapshot.exists()) {
                return snapshot.val();
            } else {
                console.log("No data available");
            }
        })
        .catch((error) => {
            console.error(error);
        });
}

export async function writeData(path, data, overwrite = false) {
    if (overwrite) {
        set(ref(database, path), data)
            .then(() => {
                console.log("data written successfully");
            })
            .catch(() => {
                console.log("error writing data");
            });
    } else {
        push(ref(database, path), data)
            .then(() => {
                console.log("data written successfully");
            })
            .catch(() => {
                console.log("error writing data");
            });
    }
}

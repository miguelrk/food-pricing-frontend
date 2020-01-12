<script>
import store from "@/store/index.js";
import { database } from "@/firebase.js";

export default {
  data() {
    return {
      predictions: []
    };
  },

  firestore: {
    predictions: database.collection("predictions")
  },
  methods: {
    ////////// Used by DashboardForm, GatewayForm, DatasourceForm, etc  //////////
    updateDoc(collectionRef, docId, data) {
      const date = new Date();
      collectionRef
        .doc(docId)
        .update({ ...data, updatedDate: date })
        .then(() => {
          window.console.log("Updated item successfully");
          store.commit("FIRE_NOTIFICATION", {
            text: "Updated item successfully",
            type: "success"
          });
        })
        .catch(error => {
          window.console.error(`Error updating document: ${error}`);
          store.commit("FIRE_NOTIFICATION", {
            text: error,
            type: "error"
          });
        });
    },
    createDoc(collectionRef, data) {
      const date = new Date();
      collectionRef
        .add(data) // Adds new document with a generated id
        .then(docRef => {
          docRef.update({
            id: docRef.id, // copies auto-generated id
            createdDate: date,
            updatedDate: date
          });
          window.console.log("Created item successfully");
          store.commit("FIRE_NOTIFICATION", {
            text: "Created item successfully",
            type: "success"
          });
        })
        .catch(error => {
          window.console.error(`Error adding item: ${error}`);
          store.commit("FIRE_NOTIFICATION", {
            text: error,
            type: "error"
          });
        });
    },
    cloneDoc(collectionRef, doc) {
      const date = new Date();
      collectionRef
        .add(doc) // Adds new document with a generated id
        .then(docRef => {
          docRef.update({
            id: docRef.id, // copies auto-generated id
            createdDate: date,
            updatedDate: date
          });
          window.console.log("Created item successfully");
          store.commit("FIRE_NOTIFICATION", {
            text: "Created item successfully",
            type: "success"
          });
        })
        .catch(error => {
          window.console.error("Error adding item: ", error);
          store.commit("FIRE_NOTIFICATION", {
            text: error,
            type: "error"
          });
        });
    },
    deleteDocById(collectionRef, docId) {
      collectionRef
        .doc(docId)
        .delete()
        .then(() => {
          window.console.log(`Deleted item successfully`);
          store.commit("FIRE_NOTIFICATION", {
            text: `Deleted item successfully`,
            type: "success"
          });
        })
        .catch(error => {
          window.console.error(`Error deleting item: ${error}`);
          store.commit("FIRE_NOTIFICATION", {
            text: error,
            type: "error"
          });
        });
    },
    ////////// Used by dashboard's DatasourceForm and ActionForm /////////////////
    updateDocField(documentRef, field, data) {
      const date = new Date();
      documentRef
        .update({ [field]: data, updatedDate: date })
        .then(() => {
          window.console.log("Updated item successfully");
          store.commit("FIRE_NOTIFICATION", {
            text: `Updated item successfully`,
            type: "success"
          });
        })
        .catch(error => {
          window.console.error(`Error updating item: ${error}`);
          store.commit("FIRE_NOTIFICATION", {
            text: error,
            type: "error"
          });
        });
    }
  }
};
</script>

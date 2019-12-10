<script>
import { database } from "@/database.js";

export default {
  data() {
    return {
      data: []
    };
  },

  firestore: {
    data: database.collection("data")
  }
};
</script>

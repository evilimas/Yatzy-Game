<script setup lang="ts">
import { computed } from "vue";
import { useFirebaseStore } from "@/stores/firebaseStore";
import { auth } from "@/services/firebase";

const firebaseStore = useFirebaseStore();

interface Props {
  activePlayer: string;
  gameStarted: boolean;
  throwCount: number;
  die: number[];
  heldDie: boolean[];
  uid?: string;
  roomId?: string;
}

const props = defineProps<Props>();

const trillText = computed(() =>
  props.throwCount <= 0 ? "Ferdig, plasser terningen din" : "Ganger igjen"
);

const activeUser = () => {
  return props.activePlayer == auth.currentUser?.displayName;
};
</script>

<template>
  <div v-if="props.gameStarted" class="dice-container">
    <h4>
      Aktiv Spiller:
      <span class="green">{{ activePlayer }}</span>
    </h4>

    <div>
      <div class="button-row">
        <div class="btn-div">
          <button
            class="primary-btn"
            @click="firebaseStore.rollDice(roomId)"
            :disabled="throwCount <= 0 || !activeUser()"
            :style="{ cursor: activeUser() ? 'pointer' : 'not-allowed' }"
          >
            Trill Terninger
            <v-icon name="la-dice-solid" scale="0.8" animation="wrench" color="white" />
          </button>
        </div>
        <div class="trill-text">
          <span v-if="!(props.throwCount <= 0)" class="green">{{ props.throwCount }}</span>
          {{ trillText }}
        </div>
      </div>

      <div class="dice" :disabled="throwCount === 3">
        <button
          class="dice-span"
          v-for="(die, index) in props.die"
          :key="index"
          @click="firebaseStore.holdDie(index, roomId)"
          :disabled="!activeUser() || throwCount === 3"
          :style="{ cursor: activeUser() ? 'pointer' : 'not-allowed' }"
        >
          <div class="die">
            <v-icon
              :scale="2"
              :name="`bi-dice-${die}`"
              :style="{
                color: heldDie[index] ? '#239ba7' : 'white',
              }"
            />
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dice-container {
  padding: 1em;
  background: #222;
  border-radius: 8px;
}

h4 {
  color: rgb(218, 218, 218);
  font-weight: 600;
}
.trill-text {
  color: rgb(214, 214, 214);
  font-weight: 600;
}

.dice-span {
  background: none;
  padding: 2px;
}
.die {
  margin: 0;
}
.dice {
  display: flex;
  user-select: none;
  cursor: pointer;
}

.button-row {
  display: flex;
  flex-direction: column;
}
h4 {
  margin-bottom: 0.5em;
}
</style>

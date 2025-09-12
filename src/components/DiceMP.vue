<script setup lang="ts">
import { computed } from "vue";
// import type { DieViewState } from "../services/yatzy/types";
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
  //   diceObjects: DieViewState[];
}
const emit = defineEmits<{
  // (e: "rollDice", roomId?: string): void;
  // (e: "holdDie", index: number, roomId?: string): void;
  (e: "resetHoldDie", index: number): void;
  // throwDice: [];
  // flip: [number];
}>();

const props = defineProps<Props>();

const trillText = computed(() =>
  props.throwCount <= 0 ? "Ferdig, plasser terningen din" : "Ganger igjen"
);

const activeUser = () => {
  return props.activePlayer == auth.currentUser?.displayName;
};
</script>

<template>
  <fieldset>
    <legend>
      <h4>
        Aktiv Spiller:
        <span class="green">{{ activePlayer }}</span>
      </h4>
    </legend>
    <div>
      <div class="button-row">
        <div class="btn-div">
          <button
            class="primary-btn"
            @click="firebaseStore.rollDice()"
            :disabled="throwCount <= 0 || !activeUser()"
          >
            Trill Terninger
          </button>
        </div>
        <div class="trill-text">
          <span v-if="!(props.throwCount <= 0)" class="green">{{ props.throwCount }}</span>
          {{ trillText }}
        </div>
      </div>

      <div class="dice">
        <!-- <span
          class="dice-span"
          v-for="dieData of [1,2,3,4,5]"
          :key="dieData"
          :style="dieData.style"
          @click="emit('flip', dieData.index)"
        >
          <div>
            {{ dieData.char }}
          </div> -->
        <!-- </span> -->
        <span
          class="dice-span"
          v-for="(die, index) in props.die"
          :key="index"
          @click="firebaseStore.holdDie(index)"
        >
          <div class="die">
            <v-icon
              :scale="2"
              :name="`bi-dice-${die}`"
              :style="{ color: heldDie[index] ? 'green' : 'white' }"
            />
          </div>
        </span>
      </div>
    </div>
  </fieldset>
</template>

<style scoped>
h4 {
  color: rgb(218, 218, 218);
  font-weight: 600;
}
.trill-text {
  color: rgb(214, 214, 214);
  font-weight: 600;
}
legend {
  color: white;
  font-weight: 600;
}
.dice-span {
  line-height: 90%;
}
v-icon {
  color: white;
  font-size: 4em;
}
.dice {
  display: flex;
  user-select: none;
  cursor: pointer;
}
fieldset {
  height: 135px;
  width: 16vw;
  display: flex;
  flex-direction: column;
  align-items: baseline;
}
.button-row {
  display: flex;
  flex-direction: column;
}
</style>

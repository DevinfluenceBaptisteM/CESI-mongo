<template>
  <!-- // table-header-group; -->

  <div>
    <link
      rel="stylesheet"
      href="https://unpkg.com/vue-multiselect@2.1.0/dist/vue-multiselect.min.css"
    />
    Footer : <input v-model="showFoot" type="checkbox" /> | Selectable :
    <input v-model="rowMultipleSelect" type="checkbox" /> | Searchable :
    <input v-model="searchable" type="checkbox" /> | DblClick editable :
    <input v-model="dblClickEditable" type="checkbox" /> | insertDirection :
    <input v-model="insertDirection" type="checkbox" />

    <div class="resp-table">
      <!-- Titre du tableau -->
      <div class="resp-table-caption d-flex">
        <span>{{ title }}</span>
        <div class="">
          <button @click="newRow()">Ajouter une ligne</button>
        </div>
      </div>
      <!-- /Titre du tableau -->

      <div class="resp-table-header">
        <!-- En-tête selection du tableau -->
        <draggable v-model="dataListRender" tag="tr">
          <div
            style="height:45px;width:45px"
            v-if="rowMultipleSelect"
            class=" table-body-cell"
          >
            <input v-model="selectAll" type="checkbox" />
          </div>
          <!-- /En-tête selection du tableau -->
          <!-- En-tête data du tableau -->

          <div
            v-for="(header, iHeader) in dataListRender"
            :key="header.title"
            class="table-header-cell"
          >
            <span @click="sortable(iHeader)">
              {{ header.title }}
            </span>
            <input
              @input="searchRow(header.searchable, iHeader)"
              v-if="searchable"
              v-model="header.searchable"
              class="search-input"
              type="text"
            />
          </div>

          <!-- /En-tête data du tableau -->
          <!-- En-tête actions du tableau -->
          <div class="table-header-cell">
            Actions
          </div>
        </draggable>
        <!-- /En-tête actions du tableau -->
      </div>
      <div class="resp-table-body">
        <div
          v-for="(body, iBody) in pageOfItems"
          :key="body.title"
          class="resp-table-row"
          :onMouseOver="'this.style.background=\'' + mouseRowHover + '\''"
          :onMouseOut="'this.style.background=\'white\''"
        >
          <div v-if="rowMultipleSelect" class="table-body-cell">
            <input v-model="pageOfItems[iBody].selected" type="checkbox" />
          </div>
          <!-- /Selection du tableau -->
          <!-- Données du tableau -->
          <div
            v-for="(header, iHead) in dataListRender"
            :key="header.title"
            class="table-body-cell"
            @dblclick="dblClickEditable == true ? switchMode(iBody) : false"
          >
            <!-- valeur affiché -->
            <span v-if="pageOfItems[iBody].mode == 0">
              {{ dataListRender[iHead].prefix }}
              {{
                dataListRender[iHead].inputType == "select" ||
                dataListRender[iHead].inputType == "multiselect"
                  ? pageOfItems[iBody].data[iHead][0].value == ""
                    ? "-"
                    : pageOfItems[iBody].data[iHead][0].value
                  : pageOfItems[iBody].data[iHead]
              }}
              {{ dataListRender[iHead].suffix }}
            </span>
            <!-- /valeur affiché -->
            <!-- en mode modification -->
            <span v-else-if="pageOfItems[iBody].mode == 1">
              <!-- /si c'est un select  -->
              <multiselect
                :multiple="
                  dataListRender[iHead].inputType == 'multiselect'
                    ? true
                    : false
                "
                v-if="
                  dataListRender[iHead].inputType == 'multiselect' ||
                    dataListRender[iHead].inputType == 'select'
                "
                name=""
                id=""
                v-model="pageOfItems[iBody].data[iHead][0]"
                :options="pageOfItems[iBody].data[iHead][1]"
                label="label"
                :searchable="true"
                placeholder="Tapez pour rechercher"
                selectLabel="Tapez entrer pour sélectionner"
                selectGroupLabel="Tapez entrer pour sélectionner le groupe"
                selectedLabel="Sélectionné"
                deselectLabel="Tapez entrer pour désélectionner"
              >
                <template slot="singleLabel" slot-scope="{ option }"
                  ><strong> {{ option.label }}</strong></template
                >
              </multiselect>
              <!-- /si c'est un select  -->
              <!-- si c'est un input -->
              <ValidationProvider rules="concepteur" v-slot="{ errors }" v-else>
                <input
                  v-on:keyup.enter="switchMode(iBody)"
                  :type="dataListRender[iHead].inputType"
                  v-model="pageOfItems[iBody].data[iHead]"
                />
                <br />
                <span color="danger">{{ errors[0] }}</span>
              </ValidationProvider>
            </span>
            <!-- /si c'est un input -->

            <!-- /en mode modification -->
          </div>
          <!-- /Données du tableau -->

          <!-- Boutons d'action  -->
          <div class="table-body-cell">
            <button
              v-if="pageOfItems[iBody].mode == 0"
              @click="switchMode(iBody)"
            >
              Modifier
            </button>
            <button
              v-else-if="pageOfItems[iBody].mode == 1"
              @click="switchMode(iBody)"
            >
              Terminé
            </button>
            <button @click="removeRow(iBody)">Supprimer</button>
          </div>
          <!-- /Boutons d'action  -->
        </div>
      </div>
      <div v-if="showFoot" class="resp-table-footer">
        <!--  Pieds selection du tableau -->
        <div v-if="rowMultipleSelect" class="table-body-cell">
          <input v-model="selectAll" type="checkbox" />
        </div>
        <!-- / Pieds selection du tableau -->

        <!-- Pieds data du tableau -->
        <div
          v-for="(header, iHeader) in dataListRender"
          :key="header.title"
          class="table-footer-cell"
          @click="sortable(iHeader)"
        >
          {{ header.title }}
        </div>

        <!-- / Pieds data du tableau -->
        <!--  Pieds bouttons du tableau -->
        <div class="table-header-cell">
          Actions
        </div>
        <!-- / Pieds bouttons du tableau -->
      </div>
    </div>
    <!-- composant de pagination -->
    <jw-pagination
      :items="this.dataListBody"
      @changePage="onChangePage"
      :labels="customLabels"
      :disableDefaultStyles="true"
      :styles="customStyles"
      :pageSize="numberRowsByPages"
    ></jw-pagination>
    <!-- /composant de pagination -->
    <button
      v-if="rowMultipleSelect"
      @click="removeGroup()"
      style="display:flex;align-items:center;margin-top:20px"
    >
      Supprimer
    </button>
    <!-- <rawDisplayer class="col-2" :value="dataListBody" title="List" />

    <rawDisplayer class="col-2" :value="dataListRender" title="Headers" /> -->
  </div>
</template>

<script>
import Vue from "vue";
import JwPagination from "jw-vue-pagination";
import Multiselect from "vue-multiselect";
import draggable from "vuedraggable";
import { ValidationProvider, extend } from "vee-validate";

const customStyles = {
  li: {
    display: "inline-block",
    border: "2px solid #F1F1F1",
    margin: "5px",
    padding: "5px",
    cursor: "pointer",
  },
  a: {
    color: "black",
  },
};
Vue.component("jw-pagination", JwPagination);
Vue.component("multiselect", Multiselect);
extend("concepteur", {
  validate: (value) => value !== "MILOUX",
  message: "Merci de ne pas intégrer le nom du concepteur.",
});

export default {
  name: "Grid",
  props: {
    name: {
      type: String,
      default: "List Dynamic Editable",
    }, // nom envoyé pour le composant
    title: {
      type: String,
      default: "List Dynamic Editable",
    }, // nomenvoyé pour l’affiche eventuel d’un titre

    urlDataUser: String, // Url de l’API utilisée pour obtenir les dataUser, utile pour la fonction refresh
    urlDataList: String, // Url de l’API utilisée pour obtenir les dataList, utile pour la fonction refresh

    dataUser: Object, // récupère les données de l’utilisateur connecté (selon l’API)
    // dataList: Object, // récupère les data à afficher (selon l’API) SANS CHANGEMENT
    dataParams: Object, // prévu dans le cadre ou l’API fournirai une liste de données de configuration tel que l’ordre des colonnes, la liste des colonnes affichée par défaut

    type: {
      type: String,
      default: "list",
    }, // permet de gérer le statut du composant afin d’adapter l’affichage au mode liste ou au mode formulaire
    searchable: {
      type: Boolean,
      default: false,
    }, // permet de gérer le statut du composant afin d’adapter l’affichage au mode liste ou au mode formulaire

    id: {
      //  id personnalisable permettant de gérer si besoin les sous-classes CSS par module, la cas échant aucune incidence
      type: String,
      default: "listDynamic",
    },

    insertDirection: {
      //  determine l'insertion au début ou à la fin du tableau (0 = Fin / 1 = Début)
      type: Number,
      default: 0,
    },

    primaryColor: String, // couleur principale utilisé dans toute l’application
    secondaryColor: String, // couleur secondaire  utilisé dans toute l’application

    mouseRowHover: {
      type: String,
      default: "transparent",
    }, // permet de mettre une couleur de fond le ligne au passage de la souris
    mouseColumnsHover: {
      type: String,
      default: "transparent",
    }, // permet de mettre une couleur de fond le ligne au passage de la souris

    showHead: {
      type: Boolean,
      default: true,
    }, // permet d’activer/désactiver la visibilité de l’entête
    styleHead: {
      type: String,
      default: "normal",
    }, // permet de gérer si l’entête est fixe, si elle suit le déroulement ou normal
    showFoot: {
      type: Boolean,
      default: true,
    }, // permet d’activer/désactiver la visibilité du footer
    styleFoot: {
      type: String,
      default: "normal",
    }, // permet de gérer si le footer est fixe, si elle suit le déroulement ou normal

    ColumnsMoving: {
      type: Boolean,
      default: true,
    }, // permet d’activer/désactiver le déplacement de colonne
    ColumnsOrdering: {
      type: Boolean,
      default: true,
    }, // permet d’activer/désactiver la gestion des colonnes
    ColumnsExtensible: {
      type: Boolean,
      default: false,
    }, // permet d’activer/désactiver la possibilité d’aggrandir la largeur des colonnes
    rowMoving: {
      type: Boolean,
      default: true,
    }, // permet activer/désactiver le déplacement de ligne
    rowSelectable: {
      type: Boolean,
      default: true,
    }, // permet de sélectionner une ligne
    rowMultipleSelect: {
      type: Boolean,
      default: true,
    }, // permet de sélectionner plusieurs lignes
    numberRowsByPages: {
      type: Number,
      default: 20,
    }, // nombre de lignes par page
    dblClickEditable: {
      type: Boolean,
      default: false,
    }, // nombre de lignes par page

    page: {
      type: Number,
      default: 1,
    }, // permet d’ouvrir directement sur une page
    //CF https://docs.google.com/document/d/16EwPL4hWeBM1jrRUky4_iTt460diAe6uQaemwYMdoes/edit pour les dernières props à mettre en place
  },
  data: function() {
    return {
      dataList: [
        {
          data: [
            "MILOUX",
            "Antoine",
            "20",
            "Mâle dominant",
            "124 rue orbe",
            125,
            [
              {
                value: "",
              },
              [
                {
                  value: "Dev",
                  label: "Dev",
                },
                {
                  value: "Chef de projet",
                  label: "Chef de projet",
                },
                {
                  value: "Fait le café",
                  label: "Fait le café",
                },
                {
                  value: "DataAnalyst",
                  label: "DataAnalyst",
                },
              ],
            ],
          ],
          mode: 0,
          selected: false,
          show: true,
        },
        {
          data: [
            "THOMAS",
            "Gwendoline",
            "20",
            "F",
            "124 rue orbe",
            125,
            [
              {
                value: "",
              },
              [
                {
                  value: "RH",
                  label: "RH",
                },
                {
                  value: "Assistant RH",
                  label: "Assistant RH",
                },
                {
                  value: "Paye",
                  label: "Paye",
                },
                {
                  value: "Compatabilité",
                  label: "Compatabilité",
                },
              ],
            ],
          ],
          mode: 0,
          selected: false,
          show: true,
        },
        {
          data: [
            "MABILLE",
            "Baptiste",
            "23",
            "M",
            "4 pl de la Ht Vieille Tour",
            125,
            [
              {
                value: "",
              },
              [
                {
                  value: "1",
                  label: "Option 1",
                },
                {
                  value: "2",
                  label: "Option 2",
                },
                {
                  value: "3",
                  label: "Option 3",
                },
                {
                  value: "4",
                  label: "Option 4",
                },
              ],
            ],
          ],
          mode: 0,
          selected: false,
          show: true,
        },
        {
          data: [
            "GOLPAT",
            "Joris",
            "80",
            "Arbre",
            "50 rue coche",
            2,
            [
              {
                value: "",
              },
              [
                {
                  value: "1",
                  label: "Option 1",
                },
                {
                  value: "2",
                  label: "Option 2",
                },
                {
                  value: "3",
                  label: "Option 3",
                },
                {
                  value: "4",
                  label: "Option 4",
                },
              ],
            ],
          ],
          mode: 0,
          selected: false,
          show: true,
        },
        {
          data: [
            "AUTRE",
            "EXEMPLE",
            "35",
            "H",
            "50 rue de la paix",
            18,
            [
              {
                value: "",
              },
              [
                {
                  value: "1",
                  label: "Option 1",
                },
                {
                  value: "2",
                  label: "Option 2",
                },
                {
                  value: "3",
                  label: "Option 3",
                },
                {
                  value: "4",
                  label: "Option 4",
                },
              ],
            ],
          ],
          mode: 0,
          selected: false,
          show: true,
        },
        // {
        //   data: [
        //     "AUTRE",
        //     "EXEMPLE",
        //     "35",
        //     "H",
        //     "50 rue de la paix",
        //     18,
        //     [
        //       {
        //         value: "",
        //       },
        //       [
        //         {
        //           value: "1",
        //           label: "Option 1",
        //         },
        //         {
        //           value: "2",
        //           label: "Option 2",
        //         },
        //         {
        //           value: "3",
        //           label: "Option 3",
        //         },
        //         {
        //           value: "4",
        //           label: "Option 4",
        //         },
        //       ],
        //     ],
        //   ],
        //   mode: 0,
        //   selected: false,
        //   show: true,
        // },
        // {
        //   data: [
        //     "AUTRE",
        //     "EXEMPLE",
        //     "35",
        //     "H",
        //     "50 rue de la paix",
        //     18,
        //     [
        //       {
        //         value: "",
        //       },
        //       [
        //         {
        //           value: "1",
        //           label: "Option 1",
        //         },
        //         {
        //           value: "2",
        //           label: "Option 2",
        //         },
        //         {
        //           value: "3",
        //           label: "Option 3",
        //         },
        //         {
        //           value: "4",
        //           label: "Option 4",
        //         },
        //       ],
        //     ],
        //   ],
        //   mode: 0,
        //   selected: false,
        //   show: true,
        // },
        // {
        //   data: [
        //     "AUTRE",
        //     "EXEMPLE",
        //     "35",
        //     "H",
        //     "50 rue de la paix",
        //     18,
        //     [
        //       {
        //         value: "",
        //       },
        //       [
        //         {
        //           value: "1",
        //           label: "Option 1",
        //         },
        //         {
        //           value: "2",
        //           label: "Option 2",
        //         },
        //         {
        //           value: "3",
        //           label: "Option 3",
        //         },
        //         {
        //           value: "4",
        //           label: "Option 4",
        //         },
        //       ],
        //     ],
        //   ],
        //   mode: 0,
        //   selected: false,
        //   show: true,
        // },
        // {
        //   data: [
        //     "AUTRE",
        //     "EXEMPLE",
        //     "35",
        //     "H",
        //     "50 rue de la paix",
        //     18,
        //     [
        //       {
        //         value: "",
        //       },
        //       [
        //         {
        //           value: "1",
        //           label: "Option 1",
        //         },
        //         {
        //           value: "2",
        //           label: "Option 2",
        //         },
        //         {
        //           value: "3",
        //           label: "Option 3",
        //         },
        //         {
        //           value: "4",
        //           label: "Option 4",
        //         },
        //       ],
        //     ],
        //   ],
        //   mode: 0,
        //   selected: false,
        //   show: true,
        // },
        // {
        //   data: [
        //     "AUTRE",
        //     "EXEMPLE",
        //     "35",
        //     "H",
        //     "50 rue de la paix",
        //     18,
        //     [
        //       {
        //         value: "",
        //       },
        //       [
        //         {
        //           value: "1",
        //           label: "Option 1",
        //         },
        //         {
        //           value: "2",
        //           label: "Option 2",
        //         },
        //         {
        //           value: "3",
        //           label: "Option 3",
        //         },
        //         {
        //           value: "4",
        //           label: "Option 4",
        //         },
        //       ],
        //     ],
        //   ],
        //   mode: 0,
        //   selected: false,
        //   show: true,
        // },
        // {
        //   data: [
        //     "AUTRE",
        //     "EXEMPLE",
        //     "35",
        //     "H",
        //     "50 rue de la paix",
        //     18,
        //     [
        //       {
        //         value: "",
        //       },
        //       [
        //         {
        //           value: "1",
        //           label: "Option 1",
        //         },
        //         {
        //           value: "2",
        //           label: "Option 2",
        //         },
        //         {
        //           value: "3",
        //           label: "Option 3",
        //         },
        //         {
        //           value: "4",
        //           label: "Option 4",
        //         },
        //       ],
        //     ],
        //   ],
        //   mode: 0,
        //   selected: false,
        //   show: true,
        // },
        // {
        //   data: [
        //     "AUTRE",
        //     "EXEMPLE",
        //     "35",
        //     "H",
        //     "50 rue de la paix",
        //     18,
        //     [
        //       {
        //         value: "",
        //       },
        //       [
        //         {
        //           value: "1",
        //           label: "Option 1",
        //         },
        //         {
        //           value: "2",
        //           label: "Option 2",
        //         },
        //         {
        //           value: "3",
        //           label: "Option 3",
        //         },
        //         {
        //           value: "4",
        //           label: "Option 4",
        //         },
        //       ],
        //     ],
        //   ],
        //   mode: 0,
        //   selected: false,
        //   show: true,
        // },
        // {
        //   data: [
        //     "AUTRE",
        //     "EXEMPLE",
        //     "35",
        //     "H",
        //     "50 rue de la paix",
        //     18,
        //     [
        //       {
        //         value: "",
        //       },
        //       [
        //         {
        //           value: "1",
        //           label: "Option 1",
        //         },
        //         {
        //           value: "2",
        //           label: "Option 2",
        //         },
        //         {
        //           value: "3",
        //           label: "Option 3",
        //         },
        //         {
        //           value: "4",
        //           label: "Option 4",
        //         },
        //       ],
        //     ],
        //   ],
        //   mode: 0,
        //   selected: false,
        //   show: true,
        // },
        // {
        //   data: [
        //     "AUTRE",
        //     "EXEMPLE",
        //     "35",
        //     "H",
        //     "50 rue de la paix",
        //     18,
        //     [
        //       {
        //         value: "",
        //       },
        //       [
        //         {
        //           value: "1",
        //           label: "Option 1",
        //         },
        //         {
        //           value: "2",
        //           label: "Option 2",
        //         },
        //         {
        //           value: "3",
        //           label: "Option 3",
        //         },
        //         {
        //           value: "4",
        //           label: "Option 4",
        //         },
        //       ],
        //     ],
        //   ],
        //   mode: 0,
        //   selected: false,
        //   show: true,
        // },
        // {
        //   data: [
        //     "AUTRE",
        //     "EXEMPLE",
        //     "35",
        //     "H",
        //     "50 rue de la paix",
        //     18,
        //     [
        //       {
        //         value: "",
        //       },
        //       [
        //         {
        //           value: "1",
        //           label: "Option 1",
        //         },
        //         {
        //           value: "2",
        //           label: "Option 2",
        //         },
        //         {
        //           value: "3",
        //           label: "Option 3",
        //         },
        //         {
        //           value: "4",
        //           label: "Option 4",
        //         },
        //       ],
        //     ],
        //   ],
        //   mode: 0,
        //   selected: false,
        //   show: true,
        // },
        // {
        //   data: [
        //     "AUTRE",
        //     "EXEMPLE",
        //     "35",
        //     "H",
        //     "50 rue de la paix",
        //     18,
        //     [
        //       {
        //         value: "",
        //       },
        //       [
        //         {
        //           value: "1",
        //           label: "Option 1",
        //         },
        //         {
        //           value: "2",
        //           label: "Option 2",
        //         },
        //         {
        //           value: "3",
        //           label: "Option 3",
        //         },
        //         {
        //           value: "4",
        //           label: "Option 4",
        //         },
        //       ],
        //     ],
        //   ],
        //   mode: 0,
        //   selected: false,
        //   show: true,
        // },
        // {
        //   data: [
        //     "AUTRE",
        //     "EXEMPLE",
        //     "35",
        //     "H",
        //     "50 rue de la paix",
        //     18,
        //     [
        //       {
        //         value: "",
        //       },
        //       [
        //         {
        //           value: "1",
        //           label: "Option 1",
        //         },
        //         {
        //           value: "2",
        //           label: "Option 2",
        //         },
        //         {
        //           value: "3",
        //           label: "Option 3",
        //         },
        //         {
        //           value: "4",
        //           label: "Option 4",
        //         },
        //       ],
        //     ],
        //   ],
        //   mode: 0,
        //   selected: false,
        //   show: true,
        // },
        // {
        //   data: [
        //     "AUTRE",
        //     "EXEMPLE",
        //     "35",
        //     "H",
        //     "50 rue de la paix",
        //     18,
        //     [
        //       {
        //         value: "",
        //       },
        //       [
        //         {
        //           value: "1",
        //           label: "Option 1",
        //         },
        //         {
        //           value: "2",
        //           label: "Option 2",
        //         },
        //         {
        //           value: "3",
        //           label: "Option 3",
        //         },
        //         {
        //           value: "4",
        //           label: "Option 4",
        //         },
        //       ],
        //     ],
        //   ],
        //   mode: 0,
        //   selected: false,
        //   show: true,
        // },
        // {
        //   data: [
        //     "AUTRE",
        //     "EXEMPLE",
        //     "35",
        //     "H",
        //     "50 rue de la paix",
        //     18,
        //     [
        //       {
        //         value: "",
        //       },
        //       [
        //         {
        //           value: "1",
        //           label: "Option 1",
        //         },
        //         {
        //           value: "2",
        //           label: "Option 2",
        //         },
        //         {
        //           value: "3",
        //           label: "Option 3",
        //         },
        //         {
        //           value: "4",
        //           label: "Option 4",
        //         },
        //       ],
        //     ],
        //   ],
        //   mode: 0,
        //   selected: false,
        //   show: true,
        // },
        // {
        //   data: [
        //     "AUTRE",
        //     "EXEMPLE",
        //     "35",
        //     "H",
        //     "50 rue de la paix",
        //     18,
        //     [
        //       {
        //         value: "",
        //       },
        //       [
        //         {
        //           value: "1",
        //           label: "Option 1",
        //         },
        //         {
        //           value: "2",
        //           label: "Option 2",
        //         },
        //         {
        //           value: "3",
        //           label: "Option 3",
        //         },
        //         {
        //           value: "4",
        //           label: "Option 4",
        //         },
        //       ],
        //     ],
        //   ],
        //   mode: 0,
        //   selected: false,
        //   show: true,
        // },
        // {
        //   data: [
        //     "AUTRE",
        //     "EXEMPLE",
        //     "35",
        //     "H",
        //     "50 rue de la paix",
        //     18,
        //     [
        //       {
        //         value: "",
        //       },
        //       [
        //         {
        //           value: "1",
        //           label: "Option 1",
        //         },
        //         {
        //           value: "2",
        //           label: "Option 2",
        //         },
        //         {
        //           value: "3",
        //           label: "Option 3",
        //         },
        //         {
        //           value: "4",
        //           label: "Option 4",
        //         },
        //       ],
        //     ],
        //   ],
        //   mode: 0,
        //   selected: false,
        //   show: true,
        // },
        // {
        //   data: [
        //     "AUTRE",
        //     "EXEMPLE",
        //     "35",
        //     "H",
        //     "50 rue de la paix",
        //     18,
        //     [
        //       {
        //         value: "",
        //       },
        //       [
        //         {
        //           value: "1",
        //           label: "Option 1",
        //         },
        //         {
        //           value: "2",
        //           label: "Option 2",
        //         },
        //         {
        //           value: "3",
        //           label: "Option 3",
        //         },
        //         {
        //           value: "4",
        //           label: "Option 4",
        //         },
        //       ],
        //     ],
        //   ],
        //   mode: 0,
        //   selected: false,
        //   show: true,
        // },
        // {
        //   data: [
        //     "AUTRE",
        //     "EXEMPLE",
        //     "35",
        //     "H",
        //     "50 rue de la paix",
        //     18,
        //     [
        //       {
        //         value: "",
        //       },
        //       [
        //         {
        //           value: "1",
        //           label: "Option 1",
        //         },
        //         {
        //           value: "2",
        //           label: "Option 2",
        //         },
        //         {
        //           value: "3",
        //           label: "Option 3",
        //         },
        //         {
        //           value: "4",
        //           label: "Option 4",
        //         },
        //       ],
        //     ],
        //   ],
        //   mode: 0,
        //   selected: false,
        //   show: true,
        // },
        // {
        //   data: [
        //     "AUTRE",
        //     "EXEMPLE",
        //     "35",
        //     "H",
        //     "50 rue de la paix",
        //     18,
        //     [
        //       {
        //         value: "",
        //       },
        //       [
        //         {
        //           value: "1",
        //           label: "Option 1",
        //         },
        //         {
        //           value: "2",
        //           label: "Option 2",
        //         },
        //         {
        //           value: "3",
        //           label: "Option 3",
        //         },
        //         {
        //           value: "4",
        //           label: "Option 4",
        //         },
        //       ],
        //     ],
        //   ],
        //   mode: 0,
        //   selected: false,
        //   show: true,
        // },
        // {
        //   data: [
        //     "AUTRE",
        //     "EXEMPLE",
        //     "35",
        //     "H",
        //     "50 rue de la paix",
        //     18,
        //     [
        //       {
        //         value: "",
        //       },
        //       [
        //         {
        //           value: "1",
        //           label: "Option 1",
        //         },
        //         {
        //           value: "2",
        //           label: "Option 2",
        //         },
        //         {
        //           value: "3",
        //           label: "Option 3",
        //         },
        //         {
        //           value: "4",
        //           label: "Option 4",
        //         },
        //       ],
        //     ],
        //   ],
        //   mode: 0,
        //   selected: false,
        //   show: true,
        // },
        // {
        //   data: [
        //     "AUTRE",
        //     "EXEMPLE",
        //     "35",
        //     "H",
        //     "50 rue de la paix",
        //     18,
        //     [
        //       {
        //         value: "",
        //       },
        //       [
        //         {
        //           value: "1",
        //           label: "Option 1",
        //         },
        //         {
        //           value: "2",
        //           label: "Option 2",
        //         },
        //         {
        //           value: "3",
        //           label: "Option 3",
        //         },
        //         {
        //           value: "4",
        //           label: "Option 4",
        //         },
        //       ],
        //     ],
        //   ],
        //   mode: 0,
        //   selected: false,
        //   show: true,
        // },
        // {
        //   data: [
        //     "AUTRE",
        //     "EXEMPLE",
        //     "35",
        //     "H",
        //     "50 rue de la paix",
        //     18,
        //     [
        //       {
        //         value: "",
        //       },
        //       [
        //         {
        //           value: "1",
        //           label: "Option 1",
        //         },
        //         {
        //           value: "2",
        //           label: "Option 2",
        //         },
        //         {
        //           value: "3",
        //           label: "Option 3",
        //         },
        //         {
        //           value: "4",
        //           label: "Option 4",
        //         },
        //       ],
        //     ],
        //   ],
        //   mode: 0,
        //   selected: false,
        //   show: true,
        // },
        // {
        //   data: [
        //     "AUTRE",
        //     "EXEMPLE",
        //     "35",
        //     "H",
        //     "50 rue de la paix",
        //     18,
        //     [
        //       {
        //         value: "",
        //       },
        //       [
        //         {
        //           value: "1",
        //           label: "Option 1",
        //         },
        //         {
        //           value: "2",
        //           label: "Option 2",
        //         },
        //         {
        //           value: "3",
        //           label: "Option 3",
        //         },
        //         {
        //           value: "4",
        //           label: "Option 4",
        //         },
        //       ],
        //     ],
        //   ],
        //   mode: 0,
        //   selected: false,
        //   show: true,
        // },
      ],
      customStyles,
      pageOfItems: [],
      customLabels: {
        first: "<< Début <<",
        last: ">> Fin >>",
        previous: "< Précédent <",
        next: "> Suivant >",
      },
      selectAll: false,
      dataListRender: [
        {
          title: "Nom",
          prefix: "",
          suffix: "",
          inputType: "text",
          sortable: 0,
          searchable: "",
          required: false,
        },
        {
          title: "Prénom",
          prefix: "",
          suffix: "",
          inputType: "text",
          sortable: 0,
          searchable: "",
          required: true,
        },
        {
          title: "Age",
          prefix: "",
          suffix: "ans",
          inputType: "number",
          sortable: 0,
          searchable: "",
          required: true,
        },
        {
          title: "Genre",
          prefix: "",
          suffix: "",
          inputType: "text",
          sortable: 0,
          searchable: "",
          required: true,
        },
        {
          title: "Adresse",
          prefix: "",
          suffix: "",
          inputType: "text",
          sortable: 0,
          searchable: "",
          required: true,
        },
        {
          title: "Prix",
          prefix: "",
          suffix: "€",
          inputType: "text",
          sortable: 0,
          searchable: "",
          required: true,
        },
        {
          title: "Type",
          prefix: "",
          suffix: "",
          inputType: "select",
          sortable: 0,
          searchable: "",
          required: true,
        },
      ],
      dataListBody: [],
      dataListSelected: {},
    };
  },
  mounted() {
    this.dataListBody = this.dataList.filter((data) => data.show == true);
  },
  methods: {
    newRow() {
      console.log(this.insertDirection == 0 ? "Bas" : "Haut");
      if (this.insertDirection == 0) {
        this.dataListBody.push({
          data: [
            "",
            "",
            "",
            "",
            "",
            0,
            [
              {
                value: "",
              },
              [
                {
                  value: "Dev",
                  label: "Dev",
                },
                {
                  value: "Chef de projet",
                  label: "Chef de projet",
                },
                {
                  value: "Fait le café",
                  label: "Fait le café",
                },
                {
                  value: "DataAnalyst",
                  label: "DataAnalyst",
                },
              ],
            ],
          ],
          mode: 1,
          selected: false,
          show: true,
        });
      } else if (this.insertDirection == 1) {
        this.dataListBody.unshift({
          data: [
            "",
            "",
            "",
            "",
            "",
            0,
            [
              {
                value: "",
              },
              [
                {
                  value: "Dev",
                  label: "Dev",
                },
                {
                  value: "Chef de projet",
                  label: "Chef de projet",
                },
                {
                  value: "Fait le café",
                  label: "Fait le café",
                },
                {
                  value: "DataAnalyst",
                  label: "DataAnalyst",
                },
              ],
            ],
          ],
          mode: 1,
          selected: false,
          show: true,
        });
      }

      console.log(this.dataList);
    },
    jsonToArray(json) {
      var array = [];
      for (let i = 0; i < json.length; i++) {
        const element = json[i];
        array.push(element.label);
        console.log(element);
      }
      console.log(json);
      return array;
    },
    //  pagination
    onChangePage(pageOfItems) {
      // update page of items
      this.pageOfItems = pageOfItems;
    },
    // /pagination

    // switch entre le mode affichage et le mode de modification
    switchMode(row) {
      switch (this.dataListBody[row].mode) {
        case 0:
          this.dataListBody[row].mode = 1;
          break;
        case 1:
          var error = false;
          for (let i = 0; i < this.dataListBody[row].data.length; i++) {
            const element = this.dataListBody[row].data; //data d'une rangée
            const headerElem = this.dataListRender[i]; //header correspondant
            if (headerElem.required == true) {
              //Si la data est obligatoire (parametrable dans le dataRender)
              if (
                typeof element[i] == undefined ||
                element[i] == null ||
                element[i] == ""
              ) {
                //On vérifie si elle est renseignée
                error = true; //Si ce n'est pas le cas, erreur est passé à true
              }
            }
          }
          if (error == false) {
            //Si la boucle s'est déroulé sans erreur on ajoute à la liste
            this.dataListBody[row].mode = 0;
          }
          break;
        default:
          this.dataListBody[row].mode = 0;
          break;
      }
    },
    // /switch entre le mode affichage et le mode de modification

    // suppression de ligne
    removeRow(row) {
      this.dataListBody = this.dataListBody
        .slice(0, row)
        .concat(this.dataListBody.slice(row + 1, this.dataListBody.length));
    },
    // /suppression de ligne

    // suppression multiple
    removeGroup() {
      this.dataListBody = this.dataListBody.filter(
        (data) => data.selected == false
      );
    },
    // /suppression multiple

    // ordre d'affichage des datas
    sortable(i) {
      if (this.dataListRender.sortable != 1) {
        this.dataListBody.sort((a, b) =>
          this.dataListRender[i].inputType == "select"
            ? a.data[i][0].value > b.data[i][0].value
              ? 1
              : -1
            : a.data[i] > b.data[i]
            ? 1
            : -1
        ); //condition inline pour le tri sur select ou sur input
        this.dataListRender.sortable = 1;
      } else {
        this.dataListBody.reverse((a, b) =>
          this.dataListRender[i].inputType == "select"
            ? a.data[i][0].value > b.data[i][0].value
              ? 1
              : -1
            : a.data[i] > b.data[i]
            ? 1
            : -1
        ); //condition inline pour le tri inversé sur select ou sur input
        this.dataListRender.sortable = 0;
      }
    },
    // /ordre d'affichage des datas

    // recherche dans les colonnes
    searchRow(input, iHead) {
      this.dataListBody = this.dataList;
      if (input == "") {
        this.dataListBody = this.dataList;
      } else {
        input = input.toLowerCase();
        this.dataListBody.forEach((element) => {
          var elementValue =
            this.dataListRender[iHead].inputType == "select"
              ? element.data[iHead][0].value.toString().toLowerCase()
              : element.data[iHead].toString().toLowerCase(); // condition inline pour la recherche sur select ou la recherche sur input
          if (!elementValue.includes(input)) {
            element.show = false;
          } else {
            element.show = true;
          }
        });
        this.dataListBody = this.dataListBody.filter(
          (data) => data.show == true
        );
      }
    },
    // /recherche dans les colonnes
  },

  watch: {
    selectAll: function(val) {
      if (val == true) {
        this.dataListBody.forEach((row) => {
          row.selected = true;
        });
      } else if (val == false) {
        this.dataListBody.forEach((row) => {
          row.selected = false;
        });
      }
    },
  },
  components: {
    draggable,
    ValidationProvider,
  },
};
</script>

<!-- Scoped pour que le stlye d'applique uniquement sur ce composant  -->
<style scoped>
.search-input {
  width: 90%;
  margin: 2px;
}
.resp-table {
  width: 100%;
  display: table;
}
.resp-table-caption {
  display: table-caption;
  text-align: center;
  font-size: 30px;
  font-weight: bold;
  margin: 10px;
}
.resp-table-header {
  display: table-header-group;
  background-color: gray;
  font-weight: bold;
  font-size: 25px;
}
.table-header-cell {
  display: table-cell;
  padding: 10px;
  text-align: justify;
  border: 1px solid black;
}
.resp-table-body {
  display: table-row-group;
}
.resp-table-row {
  display: table-row;
}
.table-body-cell {
  display: table-cell;
  border: 1px solid black;
  padding-top: 10px;
  padding-bottom: 10px;
}
.resp-table-footer {
  display: table-footer-group;
  background-color: gray;
  font-weight: bold;
  font-size: 25px;
  color: rgba(255, 255, 255, 0.45);
}
.table-footer-cell {
  display: table-cell;
  padding: 10px;
  text-align: justify;
  border: 1px solid black;
}
</style>
<!-- Style global  -->
<style>
.active {
  background: #2c3e50 !important;
}
.active > a {
  color: white !important;
}
</style>

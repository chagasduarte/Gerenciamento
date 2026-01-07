import { LinhaTemporal } from "../../shared/models/linha-temporal.model";

export function converterParaGantt(dados: LinhaTemporal[]) {

  const categoryData: any[] = [];
  const seriesData: any[] = [];

  dados.forEach((item, index) => {

    const id = `gantt_${index}`;

    categoryData.push({
      id,
      name: item.descricao
    });

    seriesData.push({
      category: id,
      start: new Date(item.data_inicio).getTime(),
      end: new Date(item.data_fim).getTime(),
      id
    });
  });

  return { categoryData, seriesData };
}

export function convertePerGantt() {
  var categoryData = [{
    name: "Start",
    id: "gantt_0"
  }, {
    name: "Design",
    id: "gantt_1"
  }, {
    name: "Review",
    id: "gantt_2",
    parentId: "gantt_1",
  }, {
    name: "User tests",
    id: "gantt_3",
    parentId: "gantt_1",
  }, {
    name: "Programming",
    id: "gantt_4"
  }, {
    name: "Task delegation",
    id: "gantt_5",
    parentId: "gantt_4",
  }, {
    name: "Coding",
    id: "gantt_6",
    parentId: "gantt_4",
  }, {
    name: "Testing",
    id: "gantt_7",
    parentId: "gantt_4",
  }, {
    name: "Deploying",
    id: "gantt_8",
    parentId: "gantt_4",
  }, {
    name: "Testing",
    id: "gantt_9"
  }, {
    name: "Phase 1",
    id: "gantt_10",
    parentId: "gantt_9",
  }, {
    name: "Phase 2",
    id: "gantt_11",
    parentId: "gantt_9",
  }, {
    name: "Phase 3",
    id: "gantt_12",
    parentId: "gantt_9",
  }, {
    name: "End",
    id: "gantt_15"
  }];

  var seriesData = [{
    start: 1758229200000,
    duration: 0,
    progress: 0,
    id: "gantt_0",
    linkTo: ["gantt_1"]
  }, {
    "category": "gantt_1",
    progress: 0,
    id: "gantt_1",
    linkTo: ["gantt_4"]
  }, {
    "category": "gantt_2",
    start: 1758488400000,
    duration: 1,
    progress: 1,
    id: "gantt_2",
    linkTo: ["gantt_3"]
  }, {
    "category": "gantt_3",
    start: 1758574800000,
    duration: 1,
    progress: 1,
    id: "gantt_3",
    linkTo: []
  }, {
    "category": "gantt_4",
    progress: 0,
    id: "gantt_4",
    linkTo: ["gantt_9"]
  }, {
    "category": "gantt_5",
    start: 1758747600000,
    duration: 1,
    progress: 1,
    id: "gantt_5",
    linkTo: ["gantt_6"]
  }, {
    "category": "gantt_6",
    start: 1758834000000,
    duration: 2,
    progress: 0.4956235693230202,
    id: "gantt_6",
    linkTo: ["gantt_7"]
  }, {
    "category": "gantt_7",
    start: 1759179600000,
    duration: 1,
    progress: 0,
    id: "gantt_7",
    linkTo: ["gantt_8"]
  }, {
    "category": "gantt_8",
    start: 1759266000000,
    duration: 2,
    progress: 0,
    id: "gantt_8"
  }, {
    "category": "gantt_9",
    progress: 0,
    id: "gantt_9",
    linkTo: ["gantt_15"]
  }, {
    "category": "gantt_10",
    start: 1759438800000,
    duration: 1,
    progress: 0,
    id: "gantt_10",
    linkTo: ["gantt_11"]
  }, {
    "category": "gantt_11",
    start: 1759698000000,
    duration: 1,
    progress: 0,
    id: "gantt_11",
    linkTo: ["gantt_12"]
  }, {
    "category": "gantt_12",
    start: 1759784400000,
    duration: 2,
    progress: 0,
    id: "gantt_12"
  }, {
    start: 1760302800000,
    duration: 0,
    progress: 0,
    id: "gantt_15"
  }];
  return { categoryData, seriesData };

}
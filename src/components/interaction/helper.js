import bigdecimal from "bigdecimal";

/**
 *已知点1,2和临时点N，求矩形第三点和第四点
 *输出按顺序的矩形顶点坐标 A,B,C,D
 **/
export function rect(point1, point2, pointN) {
  var dist1 = dist(point1, pointN);
  var dist2 = dist(point2, pointN);
  let A, B, C, D;
  if (dist1 >= dist2) {
    //点2近
    A = point1;
    B = point2;
  } else {
    //点1近
    A = point2;
    B = point1;
  }
  C = rect3P(A, B, pointN);
  D = rect4P(A, B, C);
  return [A, B, C, D];
}

//计算两点距离
function dist(point1, point2) {
  var a = point1[0] - point2[0];
  var b = point1[1] - point2[1];
  return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
}

//已知矩形两个顺序点A,B和随意点N，求矩形第三点坐标
function rect3P(A, B, N) {
  let x1 = A[1],
    y1 = A[0];
  let x2 = B[1],
    y2 = B[0];
  let x0 = N[1],
    y0 = N[0];
  let k = (y2 - y1) / (x2 - x1);
  let x3 = (y2 - y0 + k * x0 + x2 / k) / (k + 1 / k);
  let y3 = y0 + k * (x3 - x0);
  return [y3, x3];
}

//已知矩形三个顺序点A,B,C，求矩形第四点坐标
function rect4P(A, B, C) {
  let x1 = A[1],
    y1 = A[0];
  let x2 = B[1],
    y2 = B[0];
  let x3 = C[1],
    y3 = C[0];
  let x4 = x3 + x1 - x2;
  let y4 = y3 + y1 - y2;
  return [y4, x4];
}

//   // 第一个点
//   let x0 = pointers[0] ? pointers[0][0] : null;
//   let y0 = pointers[0] ? pointers[0][1] : null;
//   // 第二个点
//   let x1 = pointers[1] ? pointers[1][0] : null;
//   let y1 = pointers[1] ? pointers[1][1] : null;
//   // 第三个点
//   let x2 = pointers[2] ? pointers[2][0] : null;
//   let y2 = pointers[2] ? pointers[2][1] : null;
//   if (pointers[2]) {
//     let _x0 = new bigdecimal.BigDecimal(x0);
//     let _y0 = new bigdecimal.BigDecimal(y0);
//     let _x1 = new bigdecimal.BigDecimal(x1);
//     let _y1 = new bigdecimal.BigDecimal(y1);
//     let _x2 = new bigdecimal.BigDecimal(x2);
//     let _y2 = new bigdecimal.BigDecimal(y2);
//     const one = new bigdecimal.BigDecimal(1);
//     let k0 = _x1.subtract(_x2).divide(_y2.subtract(_y1), 5);
//     console.log(k0.toString());
//     let _x = _y0
//       .subtract(_y2)
//       .add(k0.multiply(_x2).add(_y0.divide(k0, 5)))
//       .divide(k0.add(one.divide(k0, 5)), 5);
//     let _y = _y2.add(k0.multiply(_x.subtract(_x2)));
//     if (_x) {
//       console.log("@@@x", _x.toString());
//       console.log("@@@y", _y.toString());
//         pointers[2][0] = _x.toString();
//         pointers[2][1] = _y.toString();
//         x2 = pointers[2][0];
//         y2 = pointers[2][1];
//     }
//     // let k0 = (x1 - x2) / (y2 - y1);
//     // let x = (y0 - y2 + (k0 * x2 + y0 / k0)) / (k0 + 1 / k0);
//     // let y = y2 + k0 * (x - x2);
//     // if (x) {
//     //   pointers[2][0] = x;
//     //   pointers[2][1] = y;
//     //   x2 = pointers[2][0];
//     //   y2 = pointers[2][1];
//     // }
//   }

//   console.log("!!!!", pointers);
//   // 第四个点
//   let x4 = null;
//   let y4 = null;
//   x4 = x0 - x1 + (x2 - x4);
//   y4 = y0 - y1 + y2;

//   // 开始坐标
//   var start = coordinates[0];
//   // 结束坐标
//   var end = coordinates[1];

//   //如果geometry对象不存在或者为空，则创建
//   if (!geometry) {
//     //多面几何图形下设置
//     geometry = new Polygon([
//       [start, [start[0], end[1]], end, [end[0], start[1]], start]
//     ]);
//   }
//   // 根据开始与结束坐标绘制,从起始点，回到起始点
//   //   geometry.setCoordinates([[
//   //     start, [start[0] - 0.00001, end[1]], end, [end[0] + 0.00001, start[1]], start]
//   //   ]);
//   const view = map.getView();
//   const zoom = view.getZoom();
//   let grade = 0.00001;

//   if (zoom < 10) {
//     grade = 10;
//   } else if (zoom > 10 && zoom < 15) {
//     grade = 0.1;
//   } else if (zoom > 15 && zoom <= 20) {
//     grade = 0.001;
//   } else if (zoom > 20 && zoom <= 25) {
//     grade = 0.0001;
//   }

//   console.log("------------------------------------");
//   console.log(zoom);
//   console.log("------------------------------------");

//   geometry.setCoordinates([
//     [
//       start,
//       [start[0] + grade / zoom, end[1]],
//       end,
//       [end[0] - grade / zoom, start[1]],
//       start
//     ]
//   ]);

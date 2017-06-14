/*

Dragon Curve Generator
Copyright (C) 2017 Adam Bac

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.

*/

var canvas;
var ctx;
var curveLevelSlider;
var numOfIterationsLabel;
var defaultEndpoints = [[200, 400], [600, 400]];

function onLoad() {
    canvas = document.getElementById("canvas");
    curveLevelSlider = document.getElementById("curve-level-slider");
    numOfIterationsLabel = document.getElementById("num-of-iterations");
    if(canvas.getContext) {
        ctx = canvas.getContext("2d");
    }

    curveLevelSlider.value = 15;
    draw();
}

function drawPath(points) {
    ctx.beginPath();
    ctx.moveTo(points[0][0], points[0][1]);
    for(var i = 1; i < points.length; i++)
        ctx.lineTo(points[i][0], points[i][1]);
    ctx.stroke();
}

function getNewPoint(p1, p2, dir) {
    var x = p2[0] - p1[0];
    var y = p2[1] - p1[1];
    var s = Math.SQRT1_2*Math.SQRT1_2;
    
    if(dir == 0)
        return [ p1[0] + s*x + s*y,
                 p1[1] - s*x + s*y ];
    else
        return [ p1[0] + s*x - s*y,
                 p1[1] + s*x + s*y ];
}

function iterate(p) {
    var new_points = [p[0]];
    dir = 0;
    for(var i = 1; i < p.length; i++) {
        new_points.push(getNewPoint(p[i - 1], p[i], dir));
        new_points.push(p[i]);
        if(dir == 0)
            dir = 1;
        else
            dir = 0;
    }
    return new_points;
}

function drawDragonCurve(begin, end, level) {
    var path = [begin, end];
    for(var i = 0; i < level; i++)
        path = iterate(path);
    drawPath(path);
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function draw() {
    numOfIterationsLabel.innerHTML = curveLevelSlider.value.toString();
    clearCanvas();
    drawDragonCurve(defaultEndpoints[0], defaultEndpoints[1], curveLevelSlider.value);
}

function animateCurve() {
    curveLevelSlider.disabled = true;
    var level = 0;

    var update = function() {
        curveLevelSlider.value = level;
        draw();
        level++;
        if(level <= 20) window.setTimeout(update, 1000);
        else curveLevelSlider.disabled = false;
    }

    update();
}


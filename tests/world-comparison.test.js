import test from 'node:test';import assert from 'node:assert/strict';
import {prepareWorldComparison} from '../world/comparison.js';
import {worldOverview} from '../world/navigation.js';
test('different spatial footprints use exactly the same comparison camera',()=>{
 const [a,b]=prepareWorldComparison('site',{ids:[95,115],sun:{hour:15}},{ids:[118],sun:{hour:9}});
 assert.deepEqual(worldOverview(a),worldOverview(b));assert.equal(a.state.sun.hour,15);assert.equal(b.state.sun.hour,9);
});
test('plan comparison exposes both interiors consistently without changing stored preferences',()=>{
 const current={ids:[129,139],cutaway:true},saved={ids:[147],cutaway:false};const before=JSON.stringify([current,saved]);
 const [a,b]=prepareWorldComparison('plan',current,saved);assert.equal(a.cutaway,true);assert.equal(b.cutaway,true);assert.equal(JSON.stringify([current,saved]),before);
 assert.ok(prepareWorldComparison('room',{ids:[180]},{ids:[182]}).every(s=>s.cutaway));
});

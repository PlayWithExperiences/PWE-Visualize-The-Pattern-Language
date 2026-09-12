import test from 'node:test';
import assert from 'node:assert/strict';
import {World} from '../world/primitives.js';
import {auditRoutes} from '../world/route-audit.js';
test('tree blocking a path is detected without any solid-solid intersection',()=>{
 const w=new World('test',10,10,[1,2]);w.path([[1,5],[9,5]],1.5,1);w.tree(5,5,2);
 const hits=auditRoutes(w.finish());assert.ok(hits.some(h=>h.pattern===1&&h.blocker===2&&h.kind==='trunk'));
});
test('raised floors block a direct approach but continuous staircase segments remain traversable',()=>{
 const blocked=new World('test',10,10,[1]);blocked.slab(4,2,3,3,1,undefined,.5);blocked.path([[2,3],[5,3]],1,1);
 assert.ok(auditRoutes(blocked.finish()).some(h=>h.kind==='floor'));
 const clear=new World('test',10,10,[1]);clear.steps(3,2,2,4,1,.16,.3);clear.slab(3,3.2,2,2,1,undefined,.64);clear.path([[4,1.8],[4,3.4],[4,4.5]],1,1);
 assert.deepEqual(auditRoutes(clear.finish()),[]);
});
test('leaving the actual world ground is reported as unreachable',()=>{
 const w=new World('test',10,10,[1]);w.path([[0,0],[100,0]],1,1);assert.ok(auditRoutes(w.finish()).some(h=>h.kind==='outside-ground'));
});

test('continuous horizontal clearance catches a narrow post between height samples',()=>{
 const w=new World('test',10,10,[1,2]);w.path([[0,0],[1,0]],1,1);w.box(.095,.29,0,.01,.01,2,undefined,2,'post');assert.ok(auditRoutes(w.finish()).some(h=>h.kind==='post'));
});

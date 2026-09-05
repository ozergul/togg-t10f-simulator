import test from 'node:test';
import assert from 'node:assert/strict';
import {audit,auditCoverage,systemAudit} from '../src/audit.js';
import {references} from '../src/references.js';
import {Simulation,scenarios,parameters} from '../src/simulation.js';
test('audit covers each architecture node exactly once and records every source',()=>{const c=auditCoverage();assert.equal(c.covered,c.components);assert.deepEqual(c.missing,[]);assert.deepEqual(c.duplicates,[]);assert.deepEqual(Object.keys(audit.sources).sort(),Object.keys(references).sort());assert.ok(systemAudit.every(s=>s.oemArchitectureVerified===false));assert.equal(audit.homologationVerified,false);});
test('low SOC affects discharge, not the independent charger limit',()=>{const s=new Simulation();s.reset(scenarios.findIndex(s=>s.id==='low'));while(!['done','failed'].includes(s.status))s.next();assert.equal(s.state.dischargeLimitKW,15);assert.equal(s.state.chargeLimit,180);assert.equal(s.state.torqueLimitNm,30);s.state.speed=100;s.state.torque=350;s.state.park=false;s.integrate(1000);assert.ok(s.state.power<=15);assert.ok(s.state.power>0);});
test('positive traction respects the reference motor power ceiling',()=>{const s=new Simulation();s.reset(scenarios.findIndex(s=>s.id==='drive'));s.state.speed=170;s.state.torque=350;s.integrate(1000);assert.ok(s.state.power<=parameters.maxPowerKW/.9+.35);});

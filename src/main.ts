// wotan-disable async-function-assignability

import * as utils from "@iobroker/adapter-core";
import { Driver, ZWaveNode } from "zwave-js";
import { getCCName } from "zwave-js/build/lib/commandclass/CommandClasses";
import {
	ZWaveNodeMetadataUpdatedArgs,
	ZWaveNodeValueAddedArgs,
	ZWaveNodeValueRemovedArgs,
	ZWaveNodeValueUpdatedArgs,
} from "zwave-js/build/lib/node/Node";
import { ValueID } from "zwave-js/build/lib/node/ValueDB";
import { Global as _ } from "./lib/global";
import {
	computeId,
	extendMetadata,
	extendValue,
	removeValue,
} from "./lib/objects";

// Augment the adapter.config object with the actual types
declare global {
	// eslint-disable-next-line @typescript-eslint/no-namespace
	namespace ioBroker {
		interface AdapterConfig {
			serialport: string;
		}
	}
}

class Zwave2 extends utils.Adapter {
	public constructor(options: Partial<ioBroker.AdapterOptions> = {}) {
		super({
			...options,
			name: "zwave2",
		});
		this.on("ready", this.onReady.bind(this));
		this.on("objectChange", this.onObjectChange.bind(this));
		this.on("stateChange", this.onStateChange.bind(this));
		this.on("message", this.onMessage.bind(this));
		this.on("unload", this.onUnload.bind(this));
	}

	private driver!: Driver;

	/**
	 * Is called when databases are connected and adapter received configuration.
	 */
	private async onReady(): Promise<void> {
		// Make adapter instance global
		_.adapter = this;

		await this.subscribeStatesAsync("*");

		this.setState("info.connection", false, true);
		if (!this.config.serialport) {
			this.log.warn(
				"No serial port configured. Please select one in the adapter settings!",
			);
			return;
		}

		this.driver = new Driver(this.config.serialport);
		this.driver.once("driver ready", () => {
			this.setState("info.connection", true, true);

			this.log.info(
				`The driver is ready. Found ${this.driver.controller.nodes.size} nodes.`,
			);
			this.driver.controller.nodes.forEach(
				this.addNodeEventHandlers.bind(this),
			);
		});
		await this.driver.start();
	}

	private addNodeEventHandlers(node: ZWaveNode): void {
		node.once(
			"interview completed",
			this.onNodeInterviewCompleted.bind(this),
		)
			.on("wake up", this.onNodeWakeUp.bind(this))
			.on("sleep", this.onNodeSleep.bind(this))
			.on("alive", this.onNodeAlive.bind(this))
			.on("dead", this.onNodeDead.bind(this))
			.on("value added", this.onNodeValueAdded.bind(this))
			.on("value updated", this.onNodeValueUpdated.bind(this))
			.on("value removed", this.onNodeValueRemoved.bind(this))
			.on("metadata updated", this.onNodeMetadataUpdated.bind(this));
	}

	private async onNodeInterviewCompleted(node: ZWaveNode): Promise<void> {
		this.log.info(`Node ${node.id}: interview completed`);
		// Prepare data points for all the node's values
		for (const valueId of node.getDefinedValueIDs()) {
			const value = node.getValue(valueId);
			await extendValue(node, {
				...valueId,
				newValue: value,
				commandClassName: getCCName(valueId.commandClass),
			});
		}
	}

	private onNodeWakeUp(node: ZWaveNode): void {
		this.log.info(`Node ${node.id}: is now awake`);
	}

	private onNodeSleep(node: ZWaveNode): void {
		this.log.info(`Node ${node.id}: is now asleep`);
	}

	private onNodeAlive(node: ZWaveNode): void {
		this.log.info(`Node ${node.id}: has returned from the dead`);
	}

	private onNodeDead(node: ZWaveNode): void {
		this.log.info(`Node ${node.id}: is now dead`);
	}

	private async onNodeValueAdded(
		node: ZWaveNode,
		args: ZWaveNodeValueAddedArgs,
	): Promise<void> {
		let propertyName = computeId(node.id, args);
		propertyName = propertyName.substr(propertyName.lastIndexOf(".") + 1);
		this.log.debug(
			`Node ${node.id}: value added: ${propertyName} => ${args.newValue}`,
		);
		await extendValue(node, args);
	}

	private async onNodeValueUpdated(
		node: ZWaveNode,
		args: ZWaveNodeValueUpdatedArgs,
	): Promise<void> {
		let propertyName = computeId(node.id, args);
		propertyName = propertyName.substr(propertyName.lastIndexOf(".") + 1);
		this.log.debug(
			`Node ${node.id}: value updated: ${propertyName} => ${args.newValue}`,
		);
		await extendValue(node, args);
	}

	private async onNodeValueRemoved(
		node: ZWaveNode,
		args: ZWaveNodeValueRemovedArgs,
	): Promise<void> {
		let propertyName = computeId(node.id, args);
		propertyName = propertyName.substr(propertyName.lastIndexOf(".") + 1);
		this.log.debug(`Node ${node.id}: value removed: ${propertyName}`);
		await removeValue(node.id, args);
	}

	private async onNodeMetadataUpdated(
		node: ZWaveNode,
		args: ZWaveNodeMetadataUpdatedArgs,
	): Promise<void> {
		let propertyName = computeId(node.id, args);
		propertyName = propertyName.substr(propertyName.lastIndexOf(".") + 1);
		this.log.debug(`Node ${node.id}: metadata updated: ${propertyName}`);
		await extendMetadata(node, args);
	}

	/**
	 * Is called when adapter shuts down - callback has to be called under any circumstances!
	 */
	private async onUnload(callback: () => void): Promise<void> {
		try {
			this.log.info("Shutting down driver...");
			await this.driver.destroy();
			this.log.info("Cleaned everything up!");
			callback();
		} catch (e) {
			callback();
		}
	}

	/**
	 * Is called if a subscribed object changes
	 */
	private onObjectChange(
		id: string,
		obj: ioBroker.Object | null | undefined,
	): void {
		if (obj) {
			// The object was changed
			this.log.debug(`object ${id} changed: ${JSON.stringify(obj)}`);
		} else {
			// The object was deleted
			this.log.debug(`object ${id} deleted`);
		}
	}

	/**
	 * Is called if a subscribed state changes
	 */
	private async onStateChange(
		id: string,
		state: ioBroker.State | null | undefined,
	): Promise<void> {
		if (state) {
			// The state was changed
			this.log.debug(
				`state ${id} changed: ${state.val} (ack = ${state.ack})`,
			);

			if (!state.ack) {
				const { native } = (await this.getObjectAsync(id))!;
				const nodeId: number | undefined = native.nodeId;
				if (!nodeId) {
					this.log.error(
						`Node ID missing from object definition ${id}!`,
					);
					return;
				}
				const valueId: ValueID | undefined = native.valueId;
				if (
					!(valueId && valueId.commandClass && valueId.propertyName)
				) {
					this.log.error(
						`Value ID missing or incomplete in object definition ${id}!`,
					);
					return;
				}
				const node = this.driver.controller.nodes.get(nodeId);
				if (!node) {
					this.log.error(`Node ${nodeId} does not exist!`);
					return;
				}

				try {
					await node.setValue(valueId, state.val);
					await this.setStateAsync(id, state.val, true);
				} catch (e) {
					this.log.error(e.message);
				}
			}
		} else {
			// The state was deleted
			this.log.debug(`state ${id} deleted`);
		}
	}

	/**
	 * Some message was sent to this instance over message box. Used by email, pushover, text2speech, ...
	 * Using this method requires "common.message" property to be set to true in io-package.json
	 */
	private async onMessage(obj: ioBroker.Message): Promise<void> {
		// responds to the adapter that sent the original message
		const respond = (response: any): void => {
			// wotan-disable-next-line no-useless-predicate
			if (obj.callback)
				this.sendTo(obj.from, obj.command, response, obj.callback);
		};
		// some predefined responses so we only have to define them once
		const responses = {
			ACK: { error: null },
			OK: { error: null, result: "ok" },
			ERROR_UNKNOWN_COMMAND: { error: "Unknown command!" },
			MISSING_PARAMETER: (paramName: string) => {
				return { error: 'missing parameter "' + paramName + '"!' };
			},
			COMMAND_RUNNING: { error: "command running" },
			RESULT: (result: unknown) => ({ error: null, result }),
			ERROR: (error: string) => ({ error }),
		};
		// make required parameters easier
		// function requireParams(...params: string[]): boolean {
		// 	if (!params.length) return true;
		// 	for (const param of params) {
		// 		if (!(obj.message && obj.message.hasOwnProperty(param))) {
		// 			respond(responses.MISSING_PARAMETER(param));
		// 			return false;
		// 		}
		// 	}
		// 	return true;
		// }
		// wotan-disable-next-line no-useless-predicate
		if (obj) {
			switch (obj.command) {
				case "getNetworkMap": {
					let controller: Driver["controller"];
					try {
						controller = this.driver.controller;
					} catch (e) {
						return respond(
							responses.ERROR(
								"The driver is not yet ready to show the network map!",
							),
						);
					}
					const map = [...controller.nodes.values()].map(node => ({
						id: node.id,
						name: `Node ${node.id}`,
						neighbors: node.neighbors,
					}));
					respond(responses.RESULT(map));
					return;
				}

				case "getSerialPorts": {
					const ports = await Driver.enumerateSerialPorts();
					respond(responses.RESULT(ports));
					return;
				}
			}
		}
	}
}

if (module.parent) {
	// Export the constructor in compact mode
	module.exports = (options: Partial<ioBroker.AdapterOptions> | undefined) =>
		new Zwave2(options);
} else {
	// otherwise start the instance directly
	(() => new Zwave2())();
}

process.on("unhandledRejection", r => {
	throw r;
});

import { Injectable } from '@nestjs/common';
import { PluginRuntime } from '../../types/runtime';

@Injectable()
export class PluginService {
  private _plugin: PluginRuntime | undefined;

  set plugin(plugin: PluginRuntime) {
    this._plugin = plugin;
  }

  get plugin(): PluginRuntime {
    if (!this._plugin) {
      throw new Error('Plugin is not set');
    }
    return this._plugin;
  }
}

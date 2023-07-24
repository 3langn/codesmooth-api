import { Module } from "@nestjs/common";
import { PrometheusModule } from "@willsoto/nestjs-prometheus";
import { register } from "prom-client";

export const TRACING_PLUGIN_KEY = "TRACING_PLUGIN_KEY";
export const METRICS_PLUGIN_KEY = "METRICS_PLUGIN_KEY";

@Module({
  imports: [PrometheusModule.register()],
})
export class PromModule {}

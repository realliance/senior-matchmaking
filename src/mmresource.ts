import { KubeConfig, CustomObjectsApi } from '@kubernetes/client-node';

export interface AllocationResponse {
    kind: string;
    apiVersion: string;
    metadata: {
        name: string;
        namespace: string;
        creationTimestamp: string;
    }
    spec: Record<string, unknown>;
    status: {
        state: string;
        gameServerName: string;
        ports: [
            {
                name: string;
                port: number;
            },
        ]
        address: string;
        nodeName: string;
    }
}

export interface ServerRecord {
    ip: string;
    port: number;
    serverName: string;
}

export class MatchMakingServerAllocator {
    api: CustomObjectsApi;

    fleet: string;

    namespace: string;

    constructor(fleet: string, namespace: string) {
        const kc: KubeConfig = new KubeConfig();
        kc.loadFromDefault();
        this.api = kc.makeApiClient(CustomObjectsApi);

        this.fleet = fleet;
        this.namespace = namespace;
    }

    async allocateServer() : Promise<ServerRecord|null> {
        const res = await this.api.createNamespacedCustomObject('allocation.agones.dev', 'v1', this.namespace, 'gameserverallocations', {
            kind: 'GameServerAllocation',
            spec: {
                required: {
                    matchLabels: {
                        'agones.dev/fleet': this.fleet,
                    },
                },
            },
        });

        const alloc : AllocationResponse = <AllocationResponse> res.body;
        if (alloc?.status?.state === 'Allocated') {
            return {
                ip: alloc.status.address,
                port: alloc.status.ports[0].port,
                serverName: alloc.status.gameServerName,
            };
        }

        return null;
    }
}

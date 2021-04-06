import { KubeConfig, CustomObjectsApi, Watch } from '@kubernetes/client-node';
import { ServerRecord } from './mmmatch';

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

interface ApiObject {
    metadata : {
        name : string;
    }
}

export class MatchMakingServerAllocator {
    api: CustomObjectsApi;

    fleet: string;

    namespace: string;

    watch : Watch;

    matchCleanupCallback? : (name : string) => void;

    constructor(fleet: string, namespace: string) {
        const kc: KubeConfig = new KubeConfig();

        if (process.env.KUBE_EXTENDEDLOAD !== undefined) {
            kc.loadFromDefault();
        } else {
            kc.loadFromCluster();
        }

        this.api = kc.makeApiClient(CustomObjectsApi);

        this.fleet = fleet;
        this.namespace = namespace;

        this.watch = new Watch(kc);
        this.watch.watch(`/apis/agones.dev/v1/namespaces/${namespace}/gameservers`, {},
            this.internalWatchCallback.bind(this),
            this.internalWatchDone.bind(this));
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

    internalWatchCallback(phase : string, apiObj : ApiObject) : void {
        if (phase === 'DELETED') {
            const name = apiObj?.metadata?.name;
            if (name !== undefined && this.matchCleanupCallback) {
                this.matchCleanupCallback(name);
            }
        }
    }

    internalWatchDone(err : string) : void {
        console.log('Watch disconnected:');
        console.log(err);
    }

    setMatchCleanupCallback(func : (name : string) => void) : void {
        this.matchCleanupCallback = func;
    }
}

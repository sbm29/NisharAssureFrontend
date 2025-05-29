
export interface PopulatedModule {
  _id: string;
  name: string;
}



export interface Module {
  _id: string;
  projectId: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TestSuite {
  _id: string;
  module: PopulatedModule;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export abstract class BaseRepository<T> {
  constructor(protected readonly model: any) {}

  async findById(id: string) {
    return this.model.findUnique({
      where: { id },
    });
  }

  async findMany(filters = {}) {
    return this.model.findMany({
      where: filters,
    });
  }

  async create(data: Partial<T>) {
    return this.model.create({
      data,
    });
  }

  async update(id: string, data: Partial<T>) {
    return this.model.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return this.model.delete({
      where: { id },
    });
  }
}

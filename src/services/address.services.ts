import { AppDataSource } from "../data-source";
import { Address, User } from "../entities";
import AppError from "../error";

export class AddressService {
  async update(payload: any, addressId: string): Promise<Address> {
    const addressRepo = AppDataSource.getRepository(Address);
    const userRepo = AppDataSource.getRepository(User);

    const foundUserAddress = await userRepo.findOneBy({
      address: { id: addressId },
    });

    if (!foundUserAddress) {
      throw new AppError("No user was found with respective address", 404);
    }

    const foundAddress = await addressRepo.findOneBy({ id: addressId });

    if (!foundAddress) throw new AppError("Address not found", 404);

    const updatedAddress = await addressRepo.save({
      ...foundAddress,
      ...payload,
    });

    await userRepo.save({ ...foundUserAddress, address: updatedAddress });

    return updatedAddress;
  }
}

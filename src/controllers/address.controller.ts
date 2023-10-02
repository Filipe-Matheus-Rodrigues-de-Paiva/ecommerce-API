import { Request, Response } from "express";
import { AddressService } from "../services/address.services";

export class AddressController {
  constructor(private addressService: AddressService) {}

  async update(request: Request, response: Response): Promise<Response> {
    const updatedAddress = await this.addressService.update(
      request.body,
      request.params.addressId
    );

    return response.status(200).json(updatedAddress);
  }
}
